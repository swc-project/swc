//// [privateNameUnused.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _class_private_method_get } from "@swc/helpers/_/_class_private_method_get";
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
var _used = /*#__PURE__*/ new WeakMap(), _unused = /*#__PURE__*/ new WeakMap();
export class A {
    constructor(){
        _class_private_field_init(this, _used, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _unused, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _used, "used"), _class_private_field_set(this, _unused, "unused"), console.log(_class_private_field_get(this, _used));
    }
}
var _used1 = /*#__PURE__*/ new WeakSet(), _unused1 = /*#__PURE__*/ new WeakSet();
export class A2 {
    constructor(){
        _class_private_method_init(this, _used1), _class_private_method_init(this, _unused1), console.log(_class_private_method_get(this, _used1, used).call(this));
    }
}
function used() {}
var _used2 = /*#__PURE__*/ new WeakMap(), _unused2 = /*#__PURE__*/ new WeakMap();
export class A3 {
    constructor(){
        _class_private_field_init(this, _used2, {
            get: get_used,
            set: set_used
        }), _class_private_field_init(this, _unused2, {
            get: get_unused,
            set: set_unused
        }), console.log(_class_private_field_get(this, _used2));
    }
}
function get_used() {
    return 0;
}
function set_used(value) {}
function get_unused() {
    return 0;
}
function set_unused(value) {}
