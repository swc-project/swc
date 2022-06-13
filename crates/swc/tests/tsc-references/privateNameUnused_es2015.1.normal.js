import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _used = /*#__PURE__*/ new WeakMap(), _unused = /*#__PURE__*/ new WeakMap();
// @noUnusedLocals:true 
// @noEmit: true
// @target: es2015
export class A {
    constructor(){
        _class_private_field_init(this, _used, {
            writable: true,
            value: "used"
        });
        _class_private_field_init(this, _unused, {
            writable: true,
            value: "unused"
        });
        console.log(_class_private_field_get(this, _used));
    }
}
var _used1 = /*#__PURE__*/ new WeakSet(), _unused1 = /*#__PURE__*/ new WeakSet();
export class A2 {
    constructor(){
        _class_private_method_init(this, _used1);
        _class_private_method_init(this, _unused1);
        console.log(_class_private_method_get(this, _used1, used).call(this));
    }
}
function used() {}
function unused() {}
var _used2 = /*#__PURE__*/ new WeakMap(), _unused2 = /*#__PURE__*/ new WeakMap();
export class A3 {
    constructor(){
        _class_private_field_init(this, _used2, {
            get: get_used,
            set: set_used
        });
        _class_private_field_init(this, _unused2, {
            get: get_unused,
            set: set_unused
        });
        console.log(_class_private_field_get(this, _used2));
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
