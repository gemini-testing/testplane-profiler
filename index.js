'use strict';

const fs = require('fs');
const path = require('path');

module.exports = (hermione, opts) => {
    const points = [];
    let browsers = 0;

    const monitor = setInterval(savePoint, 1000);

    const baseEmitAndWait = hermione.emitAndWait;
    hermione.emitAndWait = function (event) {
        if (event === hermione.events.RUNNER_START) {
            savePoint('RUNNER_START ->');
        }
        if (event === hermione.events.RUNNER_END) {
            savePoint('RUNNER_END ->');
        }

        return baseEmitAndWait.apply(hermione, arguments)
            .fin(() => {
                if (event === hermione.events.RUNNER_START) {
                    savePoint('RUNNER_START <-');
                }

                if (event === hermione.events.RUNNER_END) {
                    savePoint('RUNNER_END <-');
                    finish();
                }
            });
    };

    hermione.on(hermione.events.SESSION_START, () => ++browsers);
    hermione.on(hermione.events.SESSION_END, () => --browsers);

    function savePoint(event) {
        const point = {date: Date.now(), cpu: getCpuUsage(), browsers};
        if (event) {
            point.event = event;
        }
        points.push(point);
    }

    function finish() {
        clearInterval(monitor);
        console.log(points);
        mkChart(points);
    }
};

let lastTime = process.hrtime();
let lastUsage = process.cpuUsage();

function getCpuUsage() {
    const elapTime = process.hrtime(lastTime);
    const elapUsage = process.cpuUsage(lastUsage);
    lastTime = process.hrtime();
    lastUsage = process.cpuUsage();

    const elapTimeMS = hrtimeToMS(elapTime);

    const elapUserMS = elapUsage.user / 1000;
    const elapSysMS = elapUsage.system / 1000;
    const cpuPercent = (100 * (elapUserMS + elapSysMS) / elapTimeMS).toFixed(1);

    return cpuPercent;
}

function hrtimeToMS(hrtime) {
    return hrtime[0] * 1000 + hrtime[1] / 1000000;
}

function mkChart(points) {
    const template = fs.readFileSync(path.resolve(__dirname, 'chart-tmpl.html'), 'utf8');

    fs.writeFileSync('hermione-profiler.html', template.replace('{{data}}', JSON.stringify(points)));
}

