'use strict';

const path = require('path');
const fs = require('fs-extra');
const parseConfig = require('./lib/config');
const StreamWriter = require('./lib/stream-writer');
const wrapCommands = require('./lib/commands-wrapper');

module.exports = (hermione, opts) => {
    const pluginConfig = parseConfig(opts);

    if (!pluginConfig.enabled) {
        return;
    }

    let writeStream;

    hermione.on(hermione.events.RUNNER_START, () => {
        writeStream = StreamWriter.create(pluginConfig.path);
    });

    hermione.on(hermione.events.TEST_FAIL, (data) => writeStream.write(data));
    hermione.on(hermione.events.TEST_PASS, (data) => writeStream.write(data));
    hermione.on(hermione.events.RETRY, (data) => writeStream.write(data));
    hermione.on(hermione.events.ERROR, () => writeStream.end());

    hermione.on(hermione.events.NEW_BROWSER, wrapCommands);

    hermione.on(hermione.events.RUNNER_END, () => {
        writeStream.end();
        copyToReportDir(pluginConfig.path, ['index.html', 'bundle.min.js', 'styles.css']);
    });
};

function copyToReportDir(reportDir, files) {
    files.forEach((fileName) => {
        const from = path.join(__dirname, 'lib', 'static', fileName);
        const to = path.join(reportDir, fileName);
        fs.copySync(from, to);
    });
}
