//// [commonJSImportClassTypeReference.ts]
//// [main.js]
require("./mod1").K;
//// [mod1.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var K = /*#__PURE__*/ function() {
    function K() {
        _class_call_check(this, K);
    }
    return K.prototype.values = function() {
        return new K();
    }, K;
}();
exports.K = K;
