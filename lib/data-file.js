'use strict';

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

module.exports = class DataFile {
    static create(reportPath) {
        return new this(reportPath);
    }

    constructor(reportPath) {
        this._promise = fs.ensureDir(reportPath)
            .then(() => fs.open(path.join(reportPath, 'data.js')))
            .then((fd) => this._fd = fd)
            .then(() => fs.appendFile(this._fd, 'const data = ['));
    }

    write(data) {
        const commandList = _.get(data, 'hermioneCtx.commandList[0].cl', []);
        const {timeStart, timeEnd, sessionId, browserId, retry} = data;
        const testInfo = {
            n: data.fullTitle(),
            ts: timeStart,
            te: timeEnd,
            d: timeEnd - timeStart,
            sid: sessionId,
            bid: browserId,
            cl: commandList
        };

        if (retry) {
            testInfo.r = retry;
        }

        const chunk = `${JSON.stringify(testInfo)},`;
        this._promise = this._promise
            .then(() => fs.appendFile(this._fd, chunk));
    }

    end() {
        return this._promise
            .then(() => fs.appendFile(this._fd, ']'))
            .then(() => fs.close(this._fd));
    }
};
