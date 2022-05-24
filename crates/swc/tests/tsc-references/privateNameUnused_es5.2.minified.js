import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _used = new WeakMap(), _unused = new WeakMap();
export var A = function() {
    "use strict";
    _class_call_check(this, A), _class_private_field_init(this, _used, {
        writable: !0,
        value: "used"
    }), _class_private_field_init(this, _unused, {
        writable: !0,
        value: "unused"
    }), console.log(_class_private_field_get(this, _used));
};
var _used1 = new WeakSet(), _unused1 = new WeakSet();
export var A2 = function() {
    "use strict";
    _class_call_check(this, A2), _class_private_method_init(this, _used1), _class_private_method_init(this, _unused1), console.log(_class_private_method_get(this, _used1, used).call(this));
};
function used() {}
var _used2 = new WeakMap(), _unused2 = new WeakMap();
export var A3 = function() {
    "use strict";
    _class_call_check(this, A3), _class_private_field_init(this, _used2, {
        get: get_used,
        set: set_used
    }), _class_private_field_init(this, _unused2, {
        get: get_unused,
        set: set_unused
    }), console.log(_class_private_field_get(this, _used2));
};
function get_used() {
    return 0;
}
function set_used(value) {}
function get_unused() {
    return 0;
}
function set_unused(value) {}
