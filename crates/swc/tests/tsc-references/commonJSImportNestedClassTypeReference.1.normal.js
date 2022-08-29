//// [commonJSImportNestedClassTypeReference.ts]
//// [main.js]
var K = require("./mod1").K;
/** @param {K} k */ function f(k) {
    k.values();
}
//// [mod1.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var NS = {};
NS.K = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    _proto.values = function values() {
        return new NS.K();
    };
    return _class;
}();
exports.K = NS.K;
