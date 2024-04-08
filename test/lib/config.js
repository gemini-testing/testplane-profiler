'use strict';

const parseConfig = require('../../lib/config');

describe('config', () => {
    beforeEach(function() {
        this.oldArgv = process.argv;
    });

    afterEach(function() {
        process.argv = this.oldArgv;

        delete process.env['testplane_profiler_enabled'];
        delete process.env['testplane_profiler_path'];
    });

    describe('enabled', () => {
        it('should be true by default', () => {
            assert.isTrue(parseConfig({}).enabled);
        });

        it('should be set from configuration', () => {
            assert.isFalse(parseConfig({enabled: false}).enabled);
        });

        it('should be set from cli', () => {
            process.argv = process.argv.concat('--profiler-enabled', 'false');

            assert.isFalse(parseConfig({}).enabled);
        });

        it('should be set from environment variable', () => {
            process.env['testplane_profiler_enabled'] = 'false';
            console.log(process.argv);

            assert.isFalse(parseConfig({}).enabled);
        });
    });

    describe('path', () => {
        it('should be "testplane-profiler" by default', () => {
            assert.equal(parseConfig({}).path, 'testplane-profiler');
        });

        it('should be set from configuration', () => {
            assert.equal(parseConfig({path: 'some/path'}).path, 'some/path');
        });

        it('should be set from cli', () => {
            process.argv = process.argv.concat('--profiler-path', 'new/path');

            assert.equal(parseConfig({}).path, 'new/path');
        });

        it('should be set from environment variable', () => {
            process.env['testplane_profiler_path'] = 'some/path';

            assert.equal(parseConfig({}).path, 'some/path');
        });
    });
});
