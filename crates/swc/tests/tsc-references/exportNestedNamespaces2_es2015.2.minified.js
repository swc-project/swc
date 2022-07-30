exports.formatters = {};
(exports = require('./mod')).formatters.j = function(v) {
    return v;
};
(exports = require('./mod')).formatters.o = function(v) {
    return v;
};
import * as debug from './mod';
debug.formatters.j, debug.formatters.o(1);
