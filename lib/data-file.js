'use strict';

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

module.exports = class DataFile {
    static create(reportPath) {
        return new DataFile(reportPath);
    }

    constructor(reportPath) {
        fs.ensureDirSync(reportPath);
        this._stream = fs.createWriteStream(path.join(reportPath, 'data.js'));
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

        this._writeDelim();
        this._stream.write(JSON.stringify(testInfo));
    }

    end() {
        this._stream.end(']');
    }

    _writeDelim() {
        this._stream.write('const data = [');
        this._writeDelim = () => this._stream.write(',');
    }
};
