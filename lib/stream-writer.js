'use strict';

const path = require('path');
const fs = require('fs-extra');

module.exports = class StreamWriter {
    static create(reportPath) {
        return new StreamWriter(reportPath);
    }

    constructor(reportPath) {
        fs.ensureDirSync(reportPath);
        this._stream = fs.createWriteStream(path.join(reportPath, 'data.json'));
    }

    write(data) {
        const {timeStart, timeEnd, sessionId, browserId, retry} = data;
        const testInfo = {
            n: data.fullTitle(),
            d: timeEnd - timeStart,
            ts: timeStart,
            te: timeEnd,
            s: sessionId,
            b: browserId,
            c: data.history
        };

        if (retry) {
            testInfo.r = retry;
        }

        this._writeDelim();
        this._stream.write(JSON.stringify(testInfo));
    }

    end() {
        this._stream.end(']}');
    }

    _writeDelim() {
        this._stream.write('{"root":[');
        this._writeDelim = () => this._stream.write(',');
    }
};
