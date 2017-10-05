'use strict';

const utils = require('../../lib/utils');

describe('utils', () => {
    describe('filterProperties', () => {
        it('should filter EventEmitter methods from property list', () => {
            const filteredProps = utils.filterProperties(['emit', 'customCommands', 'url']);

            assert.notInclude(filteredProps, 'emit');
        });

        it('should filter "addCommand" command from property list', () => {
            const filteredProps = utils.filterProperties(['customCommands', 'addCommand']);

            assert.notInclude(filteredProps, 'addCommand');
        });

        it('should filter private methods from property list', () => {
            const filteredProps = utils.filterProperties(['_private', 'addCommand']);

            assert.notInclude(filteredProps, '_private');
        });
    });
});
