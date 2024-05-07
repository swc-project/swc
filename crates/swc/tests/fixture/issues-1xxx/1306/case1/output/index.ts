var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _class_private_field_get = require("@swc/helpers/_/_class_private_field_get");
var _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
var _class_private_field_set = require("@swc/helpers/_/_class_private_field_set");
var _create_class = require("@swc/helpers/_/_create_class");
var _name = /*#__PURE__*/ new WeakMap();
var Animal = /*#__PURE__*/ function() {
    "use strict";
    function Animal(name) {
        _class_call_check._(this, Animal);
        _class_private_field_init._(this, _name, {
            writable: true,
            value: void 0
        });
        _class_private_field_set._(this, _name, name);
    }
    _create_class._(Animal, [
        {
            key: "noise",
            value: function noise() {
                return _class_private_field_get._(this, _name).toUpperCase();
            }
        }
    ]);
    return Animal;
}();
