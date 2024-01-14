//// [exportNestedNamespaces2.ts]
//// [mod.js]
// Based on a pattern from adonis
exports.formatters = {};
//// [first.js]
exports1 = require("./mod");
exports1.formatters.j = function(v) {
    return v;
};
//// [second.js]
exports1 = require("./mod");
exports1.formatters.o = function(v) {
    return v;
};
//// [use.js]
import * as debug from "./mod";
debug.formatters.j;
var one = debug.formatters.o(1);
