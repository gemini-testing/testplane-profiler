'use strict';

const fs = require('fs-extra');
const DataFile = require('../../lib/data-file');

describe('stream writer', () => {
    const sandbox = sinon.sandbox.create();
    // let streamStub;

    const dataStub = (opts = {}) => {
        return Object.assign(
            {browserId: 'default-browser'},
            opts,
            {fullTitle: () => opts.fullTitle || 'defaultFullTitle'}
        );
    };

    const mkDataFile = (reportPath = 'default/path') => {
        return DataFile.create(reportPath);
    };

    beforeEach(() => {
    //     streamStub = {
    //         write: sinon.stub().named('write'),
    //         end: sinon.stub().named('end')
    //     };
    //     sandbox.stub(fs, 'ensureDirSync');
    //     sandbox.stub(fs, 'createWriteStream').returns(streamStub);

        sandbox.stub(fs, 'appendFile');
        sandbox.stub(fs, 'ensureDir').resolves();
        sandbox.stub(fs, 'open').resolves(12345);
        sandbox.stub(fs, 'close').resolves();
    });

    afterEach(() => sandbox.restore());

    it('should return promise on end call');
    it('should not do any fs stuff on create');

    describe('create', () => {
        it('should create ensure target dir is exists', async () => {
            const dataFile = mkDataFile('report/path');

            await dataFile.end();

            assert.calledOnceWith(fs.ensureDir, 'report/path');
        });

        it('should open data file in target dir', async () => {
            const dataFile = mkDataFile('report/path');

            await dataFile.end();

            assert.calledOnceWith(fs.open, 'report/path/data.js');
        });

        it('should write opening bracket into data file', async () => {
            fs.open.resolves(100500);
            const dataFile = mkDataFile();

            await dataFile.end();

            assert.calledWith(fs.appendFile, 100500, 'const data = [');
        });
    });

    describe('write', () => {
        const getWrittenData = () => {
            return JSON.parse(fs.appendFile.secondCall.args[1].replace(/,$/, ''));
        };

        const write = async (data) => {
            const dataFile = mkDataFile();
            dataFile.write(data);
            await dataFile.end();
        };

        it('should append data to file', async () => {
            fs.open.resolves(100500);
            const dataFile = mkDataFile();

            dataFile.write(dataStub());
            await dataFile.end();

            assert.calledThrice(fs.appendFile);
            assert.alwaysCalledWith(fs.appendFile, 100500, sinon.match.string);
        });

        it('should write data with coma at the end', async () => {
            await write(dataStub());

            const writtenData = fs.appendFile.secondCall.args[1];
            assert.match(writtenData, /,$/);
        });

        it('should write test full title', async () => {
            await write(dataStub({
                fullTitle: 'test1'
            }));

            assert.match(getWrittenData(), {
                n: 'test1'
            });
        });

        it('should write command list from hermioneCtx', async () => {
            await write(dataStub({
                hermioneCtx: {
                    commandList: [{cl: [1]}]
                }
            }));

            assert.match(getWrittenData(), {
                cl: [1]
            });
        });

        it('should write empty command list if there is no command list in data')

        it('should write timings', async () => {
            await write(dataStub({
                timeStart: 100400,
                timeEnd: 100500
            }));

            assert.match(getWrittenData(), {
                ts: 100400,
                te: 100500,
                d: 100 // duration
            });
        });

        it('should write browser data', async () => {
            await write(dataStub({
                browserId: 'bro',
                sessionId: '100500'
            }));

            assert.match(getWrittenData(), {
                bid: 'bro',
                sid: '100500'
            });
        });

        it('should write retry', async () => {
            await write(dataStub({
                retry: 100500
            }));

            assert.match(getWrittenData(), {
                r: 100500
            });
        });

        it('should not write retry there is no retry in data', async () => {
            await write(dataStub());

            assert.notProperty(getWrittenData(), 'r');
        });

    //     it('should write object with command list from data', () => {
    //         const stream = DataFile.create('report/path');
    //         const data = dataStub({
    //             fullTitle: 'test1',
    //             hermioneCtx: {
    //                 commandList: [{cl: [1]}]
    //             }
    //         });

    //         stream.write(data);
    //         const passedData = JSON.parse(streamStub.write.secondCall.args[0]);

    //         assert.deepEqual(passedData.cl, [1]);
    //     });

    //     it('should write object with empty command list if it does not exist in data', () => {
    //         const stream = DataFile.create('report/path');
    //         const data = dataStub({fullTitle: 'test1'});

    //         stream.write(data);
    //         const passedData = JSON.parse(streamStub.write.secondCall.args[0]);

    //         assert.deepEqual(passedData.cl, []);
    //     });

    //     it('should divide data chains with comma delimiter', () => {
    //         const stream = DataFile.create('report/path');

    //         stream.write(dataStub());
    //         stream.write(dataStub());

    //         // calls: 1 - open bracket, 2 - first data, 3 - delim, 4 - second data
    //         assert.calledWithExactly(streamStub.write.thirdCall, ',');
    //     });
    });

    describe('end', () => {
        it('should reject if failed to open file', async () => {
            fs.open.rejects(new Error('foo'));
            const dataFile = mkDataFile();

            await assert.isRejected(dataFile.end(), /foo/);
        });

        it('should add closing bracket to data file', async () => {
            fs.open.resolves(100500);
            const dataFile = mkDataFile();

            await dataFile.end();

            assert.calledWith(fs.appendFile, 100500, ']');
        });

        it('should close file', async () => {
            fs.open.resolves(100500);
            const dataFile = mkDataFile();

            await dataFile.end();

            assert.calledOnceWith(fs.close, 100500);
        });
    });
});
