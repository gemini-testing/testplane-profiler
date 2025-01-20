'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const parseConfig = require('./lib/config');
const StreamWriter = require('./lib/stream-writer');

module.exports = (testplane, opts) => {
    const pluginConfig = parseConfig(opts);

    Object.assign(opts, pluginConfig);

    if (!pluginConfig.enabled) {
        return;
    }

    let writeStream;
    const retriesMap = _(testplane.config.getBrowserIds())
        .zipObject()
        .mapValues(() => new Map())
        .value();

    testplane.on(testplane.events.RUNNER_START, () => {
        writeStream = StreamWriter.create(pluginConfig.path);
    });

    testplane.on(testplane.events.RETRY, (test) => {
        const fullTitle = test.fullTitle();

        const retries = retriesMap[test.browserId];
        const retry = retries.get(fullTitle) || 0;
        retries.set(fullTitle, retry + 1);
    });

    testplane.on(testplane.events.TEST_BEGIN, (test) => {
        if (test.pending) {
            return;
        }

        test.timeStart = Date.now();

        const retry = retriesMap[test.browserId].get(test.fullTitle());

        if (retry) {
            test.retry = retry;
        }
    });

    testplane.on(testplane.events.TEST_END, (test) => {
        if (test.pending) {
            return;
        }

        test.timeEnd = Date.now();
        writeStream.write(test);
    });

    testplane.on(testplane.events.ERROR, () => writeStream.end());

    testplane.on(testplane.events.RUNNER_END, () => {
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
