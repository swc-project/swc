import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakSet(), _c = /*#__PURE__*/ new WeakMap();
// @target: es2015
// @importHelpers: true
// @isolatedModules: true
// @filename: main.ts
export class C {
    constructor(){
        _class_private_method_init(this, _b);
        _class_private_field_init(this, _c, {
            get: void 0,
            set: set_c
        });
        _class_private_field_init(this, _a, {
            writable: true,
            value: 1
        });
    }
}
function b() {
    _class_private_field_set(this, _c, 42);
}
function set_c(v) {
    _class_private_field_set(this, _a, _class_private_field_get(this, _a) + v);
}
