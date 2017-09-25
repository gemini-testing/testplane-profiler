'use strict';

const _ = require('lodash');
const reservedKeys = require('./reserved-keys');

exports.filterProperties = (propsList) => {
    return _.reject(propsList, (name) => reservedKeys.includes(name) || name.startsWith('_'));
};
