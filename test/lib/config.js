'use strict';

const parseConfig = require('../../lib/config');

describe('config', () => {
    afterEach(() => delete process.env['hermione_profiler_path']);

    it('should be enabled by default', () => {
        assert.isTrue(parseConfig({}).enabled);
    });

    describe('path', () => {
        it('should be "hermione-profiler" by default', () => {
            assert.equal(parseConfig({}).path, 'hermione-profiler');
        });

        it('should be set from configuration', () => {
            assert.equal(parseConfig({path: 'some/path'}).path, 'some/path');
        });

        it('should be set from environment variable', () => {
            process.env['hermione_profiler_path'] = 'some/path';

            assert.equal(parseConfig({}).path, 'some/path');
        });
    });
});
