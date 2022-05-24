import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
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
// @module: esnext
export { A as default };
