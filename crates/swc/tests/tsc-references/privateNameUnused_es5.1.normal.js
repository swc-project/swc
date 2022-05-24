import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _used = /*#__PURE__*/ new WeakMap(), _unused = /*#__PURE__*/ new WeakMap();
// @noUnusedLocals:true 
// @noEmit: true
// @target: es2015
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _class_private_field_init(this, _used, {
        writable: true,
        value: "used"
    });
    _class_private_field_init(this, _unused, {
        writable: true,
        value: "unused"
    });
    console.log(_class_private_field_get(this, _used));
};
var _used1 = /*#__PURE__*/ new WeakSet(), _unused1 = /*#__PURE__*/ new WeakSet();
export var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
    _class_private_method_init(this, _used1);
    _class_private_method_init(this, _unused1);
    console.log(_class_private_method_get(this, _used1, used).call(this));
};
function used() {}
function unused() {}
var _used2 = /*#__PURE__*/ new WeakMap(), _unused2 = /*#__PURE__*/ new WeakMap();
export var A3 = function A3() {
    "use strict";
    _class_call_check(this, A3);
    _class_private_field_init(this, _used2, {
        get: get_used,
        set: set_used
    });
    _class_private_field_init(this, _unused2, {
        get: get_unused,
        set: set_unused
    });
    console.log(_class_private_field_get(this, _used2));
};
function get_used() {
    return 0;
}
function set_used(value) {}
function get_unused() {
    return 0;
}
function set_unused(value) {}
