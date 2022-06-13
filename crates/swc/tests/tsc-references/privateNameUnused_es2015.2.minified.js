import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _used = new WeakMap(), _unused = new WeakMap();
export class A {
    constructor(){
        _class_private_field_init(this, _used, {
            writable: !0,
            value: "used"
        }), _class_private_field_init(this, _unused, {
            writable: !0,
            value: "unused"
        }), console.log(_class_private_field_get(this, _used));
    }
}
var _used1 = new WeakSet(), _unused1 = new WeakSet();
export class A2 {
    constructor(){
        _class_private_method_init(this, _used1), _class_private_method_init(this, _unused1), console.log(_class_private_method_get(this, _used1, function() {}).call(this));
    }
}
var _used2 = new WeakMap(), _unused2 = new WeakMap();
export class A3 {
    constructor(){
        _class_private_field_init(this, _used2, {
            get: get_used,
            set: function(value) {}
        }), _class_private_field_init(this, _unused2, {
            get: get_unused,
            set: function(value) {}
        }), console.log(_class_private_field_get(this, _used2));
    }
}
function get_used() {
    return 0;
}
function get_unused() {
    return 0;
}
