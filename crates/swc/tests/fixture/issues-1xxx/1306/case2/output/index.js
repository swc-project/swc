import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var _name = /*#__PURE__*/ new WeakMap();
var Animal = /*#__PURE__*/ function() {
    "use strict";
    function Animal(name) {
        _class_call_check(this, Animal);
        _class_private_field_init(this, _name, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _name, name);
    }
    _create_class(Animal, [
        {
            key: "noise",
            value: function noise() {
                return _class_private_field_get(this, _name).toUpperCase();
            }
        }
    ]);
    return Animal;
}();
