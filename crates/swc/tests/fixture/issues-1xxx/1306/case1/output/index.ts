import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
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
    var _proto = Animal.prototype;
    _proto.noise = function noise() {
        return _class_private_field_get(this, _name).toUpperCase();
    };
    return Animal;
}();
