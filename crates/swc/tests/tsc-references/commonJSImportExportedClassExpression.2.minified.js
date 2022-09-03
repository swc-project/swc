//// [commonJSImportExportedClassExpression.ts]
//// [main.js]
var K = require("./mod1").K;
function f(k) {
    k.values();
}
//// [mod1.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
exports.K = function() {
    "use strict";
    function K() {
        _class_call_check(this, K);
    }
    return K.prototype.values = function() {}, K;
}();
