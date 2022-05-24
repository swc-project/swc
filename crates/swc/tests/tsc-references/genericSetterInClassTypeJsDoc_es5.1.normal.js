import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var _value = /*#__PURE__*/ new WeakMap();
// @target: esnext
// @lib: esnext
// @declaration: true
// @allowJs: true
// @checkJs: true
// @filename: genericSetterInClassTypeJsDoc.js
// @out: genericSetterInClassTypeJsDoc-out.js
/**
 * @template T
 */ var Box = /*#__PURE__*/ function() {
    "use strict";
    function Box(initialValue) {
        _class_call_check(this, Box);
        _class_private_field_init(this, _value, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _value, initialValue);
    }
    _create_class(Box, [
        {
            key: "value",
            get: /** @type {T} */ function get() {
                return _class_private_field_get(this, _value);
            },
            set: function set(value) {
                _class_private_field_set(this, _value, value);
            }
        }
    ]);
    return Box;
}();
new Box(3).value = 3;
