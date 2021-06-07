'use strict';

const fs = require('fs-extra');
const StreamWriter = require('../../lib/stream-writer');

describe('stream writer', () => {
    const sandbox = sinon.sandbox.create();
    let streamStub;

    const dataStub = (opts = {}) => {
        return Object.assign(
            {browserId: 'default-browser'},
            opts,
            {fullTitle: () => opts.fullTitle || 'fullTitle'}
        );
    };

    beforeEach(() => {
        streamStub = {
            write: sinon.stub().named('write'),
            end: sinon.stub().named('end')
        };
        sandbox.stub(fs, 'ensureDirSync');
        sandbox.stub(fs, 'createWriteStream').returns(streamStub);
    });

    afterEach(() => sandbox.restore());

    describe('create', () => {
        it('should create directory for report', () => {
            StreamWriter.create('report/path');

            assert.calledOnceWith(fs.ensureDirSync, 'report/path');
        });

        it('should create write stream to the passed path', () => {
            StreamWriter.create('report/path');

            assert.calledOnceWith(fs.createWriteStream, 'report/path/data.json');
        });
    });

    describe('write', () => {
        it('should write opening bracket at first call', () => {
            const stream = StreamWriter.create('report/path');

            stream.write(dataStub());

            assert.calledWith(streamStub.write.firstCall, '{"root":[');
        });

        it('should write object with "n" property as "fullTitle"', () => {
            const stream = StreamWriter.create('report/path');
            const data = dataStub({fullTitle: 'test1'});

            stream.write(data);

            assert.propertyVal(JSON.parse(streamStub.write.secondCall.args[0]), 'n', 'test1');
        });

        it('should write object with command list from data', () => {
            const stream = StreamWriter.create('report/path');
            const data = dataStub({
                fullTitle: 'test1',
                history: [{n: 'url'}]
            });

            stream.write(data);

            const passedData = JSON.parse(streamStub.write.secondCall.args[0]);

            assert.deepEqual(passedData.c, [{n: 'url'}]);
        });

        it('should divide data chains with comma delimiter', () => {
            const stream = StreamWriter.create('report/path');

            stream.write(dataStub());
            stream.write(dataStub());

            // calls: 1 - open bracket, 2 - first data, 3 - delim, 4 - second data
            assert.calledWithExactly(streamStub.write.thirdCall, ',');
        });
    });

    describe('end', () => {
        it('should end stream with the closing bracket', () => {
            const stream = StreamWriter.create('report/path');

            stream.end();
            assert.calledOnceWith(streamStub.end, ']}');
        });
    });
});
