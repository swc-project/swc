//// [commonJSImportExportedClassExpression.ts]
//// [main.js]
require("./mod1").K;
//// [mod1.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
exports.K = function() {
    function K() {
        _class_call_check(this, K);
    }
    return K.prototype.values = function() {}, K;
}();
