import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var _value = new WeakMap(), Box = function() {
    "use strict";
    function Box(initialValue) {
        _class_call_check(this, Box), _class_private_field_init(this, _value, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _value, initialValue);
    }
    return _create_class(Box, [
        {
            key: "value",
            get: function() {
                return _class_private_field_get(this, _value);
            },
            set: function(value) {
                _class_private_field_set(this, _value, value);
            }
        }
    ]), Box;
}();
new Box(3).value = 3;
