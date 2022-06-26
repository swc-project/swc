import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
// @target: esnext
var Generic;
(function(Generic) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        _create_class(C, [
            {
                key: "y",
                get: function get() {
                    return 1;
                },
                set: function set(v) {}
            }
        ]);
        return C;
    }();
    var c = new C();
    c.y = c.y;
    var _value = /*#__PURE__*/ new WeakMap();
    var Box = /*#__PURE__*/ function() {
        "use strict";
        function Box() {
            _class_call_check(this, Box);
            _class_private_field_init(this, _value, {
                writable: true,
                value: void 0
            });
        }
        _create_class(Box, [
            {
                key: "value",
                get: function get() {
                    return _class_private_field_get(this, _value);
                },
                set: function set(value) {
                    _class_private_field_set(this, _value, value);
                }
            }
        ]);
        return Box;
    }();
    new Box().value = 3;
})(Generic || (Generic = {}));
