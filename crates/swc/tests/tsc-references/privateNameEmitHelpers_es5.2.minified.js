import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _a = new WeakMap(), _b = new WeakSet(), _c = new WeakMap();
export var C = function() {
    "use strict";
    _class_call_check(this, C), _class_private_method_init(this, _b), _class_private_field_init(this, _c, {
        get: void 0,
        set: set_c
    }), _class_private_field_init(this, _a, {
        writable: !0,
        value: 1
    });
};
function set_c(v) {
    _class_private_field_set(this, _a, _class_private_field_get(this, _a) + v);
}
