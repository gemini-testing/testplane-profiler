'use strict';

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

module.exports = class StreamWriter {
    static create(reportPath) {
        return new StreamWriter(reportPath);
    }

    constructor(reportPath) {
        fs.ensureDirSync(reportPath);
        this._stream = fs.createWriteStream(path.join(reportPath, 'data.js'));
    }

    write(data) {
        const commandList = _.get(data, 'hermioneCtx.commandList[0].ch', []);
        const {duration, sessionId, browserId} = data;
        const testInfo = {[data.fullTitle()]: {
            d: duration,
            sid: sessionId,
            bid: browserId,
            cl: commandList
        }};
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
