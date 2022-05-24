import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
var _foo = /*#__PURE__*/ new WeakMap(), _bar = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _class_private_field_init(this, _foo, {
        writable: true,
        value: _class_private_field_get(this, _bar)
    });
    _class_private_field_init(this, _bar, {
        writable: true,
        value: _class_private_field_get(this, _foo)
    });
    this["#baz"] = this["#baz"] // Error (should *not* be private name error)
    ;
};
