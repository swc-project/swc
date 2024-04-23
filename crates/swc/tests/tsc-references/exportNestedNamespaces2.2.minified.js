//// [exportNestedNamespaces2.ts]
//// [mod.js]
exports.formatters = {};
//// [first.js]
(exports = require('./mod')).formatters.j = function(v) {
    return v;
};
//// [second.js]
(exports = require('./mod')).formatters.o = function(v) {
    return v;
};
//// [use.js]
import * as debug from './mod';
debug.formatters.j, debug.formatters.o(1);
