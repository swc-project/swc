import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = new WeakMap(), _bar = new WeakMap(), A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A), _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _bar, {
            writable: !0,
            value: 6
        }), this.qux = 6;
    }
    return A.prototype.quux = function() {}, A;
}();
