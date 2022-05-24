import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
var _foo = /*#__PURE__*/ new WeakMap(), _bar = /*#__PURE__*/ new WeakMap();
// @declaration: true
// @target: es2015
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _bar, {
            writable: true,
            value: 6
        });
        this.qux = 6;
    }
    var _proto = A.prototype;
    _proto.quux = function quux() {};
    return A;
}();
