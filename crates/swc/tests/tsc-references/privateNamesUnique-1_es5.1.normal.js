import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
// @strictPropertyInitialization: false
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _class_private_field_init(this, _foo, {
        writable: true,
        value: void 0
    });
};
var _foo1 = /*#__PURE__*/ new WeakMap();
var B = function B() {
    "use strict";
    _class_call_check(this, B);
    _class_private_field_init(this, _foo1, {
        writable: true,
        value: void 0
    });
};
var b = new B(); // Error: Property #foo is missing
