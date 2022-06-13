import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.B = function B() {
        return 42;
    };
    return A;
}();
// @target: ES6
// @sourcemap: false
// @declaration: false
// @module: es6
export { A as default };
