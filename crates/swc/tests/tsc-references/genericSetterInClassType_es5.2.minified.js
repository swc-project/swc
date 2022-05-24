var Generic;
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
!function(Generic) {
    var C = function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        return _create_class(C, [
            {
                key: "y",
                get: function() {
                    return 1;
                },
                set: function(v) {}
            }
        ]), C;
    }(), c = new C();
    c.y = c.y;
    var _value = new WeakMap(), Box = function() {
        "use strict";
        function Box() {
            _class_call_check(this, Box), _class_private_field_init(this, _value, {
                writable: !0,
                value: void 0
            });
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
    new Box().value = 3;
}(Generic || (Generic = {}));
