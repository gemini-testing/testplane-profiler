'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const proxyquire = require('proxyquire');
const EventEmitter = require('events').EventEmitter;
const DataFile = require('../../lib/data-file');

const mkHermione = () => {
    const emitter = new EventEmitter();

    emitter.events = {
        TEST_BEGIN: 'test-begin',
        TEST_END: 'test-end',
        RETRY: 'retry',
        RUNNER_END: 'runner-end',
        NEW_BROWSER: 'new-browser'
    };

    emitter.config = {
        getBrowserIds: sinon.stub().returns(['default-bro'])
    };

    emitter.isWorker = sinon.stub().returns(false);

    return emitter;
};

const mkTest = (opts = {}) => {
    return _.defaults(opts, {
        fullTitle: () => 'default title',
        browserId: 'default-bro'
    });
};

describe('plugin', () => {
    const sandbox = sinon.sandbox.create();
    let hermione;
    let plugin;
    let commandWrapper;

    const initPlugin_ = (opts = {}) => {
        commandWrapper = sandbox.stub();
        plugin = proxyquire('../../index', {
            './lib/commands-wrapper': commandWrapper
        });
        plugin(hermione, opts);
    };

    beforeEach(() => {
        hermione = mkHermione();

        sandbox.stub(DataFile, 'create').returns(Object.create(DataFile.prototype));
        sandbox.stub(DataFile.prototype);

        sandbox.stub(fs, 'copySync');
    });

    afterEach(() => sandbox.restore());

    it('should create data file on plugin load', () => {
        initPlugin_({path: 'report/dir'});

        assert.calledOnceWith(DataFile.create, 'report/dir');
    });

    it('should do nothing if plugin is disabled', () => {
        initPlugin_({enabled: false});

        assert.notCalled(DataFile.create);
    });

    describe('on TEST_BEGIN', () => {
        beforeEach(() => {
            initPlugin_();
        });

        it('should set timeStart for test', () => {
            sandbox.stub(Date, 'now').returns(100500);
            const test = mkTest();

            hermione.emit(hermione.events.TEST_BEGIN, test);

            assert.propertyVal(test, 'timeStart', 100500);
        });

        it('should do nothing for pending tests', () => {
            const test = mkTest({pending: true});

            hermione.emit(hermione.events.TEST_BEGIN, test);

            assert.notProperty(test, 'timeStart');
        });

        it('should set retry if test was retried', () => {
            const test = mkTest();

            hermione.emit(hermione.events.RETRY, test);
            hermione.emit(hermione.events.TEST_BEGIN, test);

            assert.propertyVal(test, 'retry', 1);
        });
    });

    describe('on TEST_END', () => {
        beforeEach(() => {
            initPlugin_();
        });

        it('should set timeEnd for test', () => {
            sandbox.stub(Date, 'now').returns(100500);
            const test = mkTest();

            hermione.emit(hermione.events.TEST_END, test);

            assert.propertyVal(test, 'timeEnd', 100500);
        });

        it('should write data to data file', () => {
            const test = mkTest();

            hermione.emit(hermione.events.TEST_END, test);

            assert.calledOnceWith(DataFile.prototype.write, test);
        });

        it('should do nothing for pending tests', () => {
            initPlugin_();

            const test = mkTest({pending: true});

            hermione.emit(hermione.events.TEST_END, test);

            assert.notProperty(test, 'timeEnd');
            assert.notCalled(DataFile.prototype.write);
        });
    });

    describe('on RUNNER_END', () => {
        it('should finalize data file', async () => {
            initPlugin_();

            await hermione.emit(hermione.events.RUNNER_END);

            assert.calledOnce(DataFile.prototype.end);
        });

        ['index.html', 'bundle.min.js', 'styles.css'].forEach((fileName, i) => {
            it(`should copy "${fileName}" service file to the report dir on runner end`, async () => {
                initPlugin_({path: 'reportDir'});

                await hermione.emit(hermione.events.RUNNER_END);

                assert.equal(fs.copySync.args[i][1], `reportDir/${fileName}`);
            });
        });
    });

    describe('on NEW_BROWSER', () => {
        it('should wrap browser commands in worker', () => {
            hermione.isWorker.returns(true);
            initPlugin_();

            hermione.emit(hermione.events.NEW_BROWSER);

            assert.calledOnce(commandWrapper);
        });

        it('should not wrap browser commands in master', () => {
            initPlugin_();

            hermione.emit(hermione.events.NEW_BROWSER);

            assert.notCalled(commandWrapper);
        });
    });
});
