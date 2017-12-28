'use strict';

const EventEmitter = require('events').EventEmitter;

module.exports = Object.keys(EventEmitter.prototype).concat([
    'addCommand',
    'screenshot',
    'saveScreenshot'
]);
