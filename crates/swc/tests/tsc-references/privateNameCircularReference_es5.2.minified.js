import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
var _foo = new WeakMap(), _bar = new WeakMap(), A = function() {
    "use strict";
    _class_call_check(this, A), _class_private_field_init(this, _foo, {
        writable: !0,
        value: _class_private_field_get(this, _bar)
    }), _class_private_field_init(this, _bar, {
        writable: !0,
        value: _class_private_field_get(this, _foo)
    }), this["#baz"] = this["#baz"];
};
