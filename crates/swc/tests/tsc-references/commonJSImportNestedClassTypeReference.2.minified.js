//// [commonJSImportNestedClassTypeReference.ts]
//// [main.js]
require("./mod1").K;
//// [mod1.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var NS = {};
NS.K = /*#__PURE__*/ function() {
    function _class() {
        _class_call_check(this, _class);
    }
    return _class.prototype.values = function() {
        return new NS.K();
    }, _class;
}(), exports.K = NS.K;
