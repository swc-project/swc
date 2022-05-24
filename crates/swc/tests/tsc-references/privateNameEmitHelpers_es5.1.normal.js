import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakSet(), _c = /*#__PURE__*/ new WeakMap();
// @target: es2015
// @importHelpers: true
// @isolatedModules: true
// @filename: main.ts
export var C = function C() {
    "use strict";
    _class_call_check(this, C);
    _class_private_method_init(this, _b);
    _class_private_field_init(this, _c, {
        get: void 0,
        set: set_c
    });
    _class_private_field_init(this, _a, {
        writable: true,
        value: 1
    });
};
function b() {
    _class_private_field_set(this, _c, 42);
}
function set_c(v) {
    _class_private_field_set(this, _a, _class_private_field_get(this, _a) + v);
}
