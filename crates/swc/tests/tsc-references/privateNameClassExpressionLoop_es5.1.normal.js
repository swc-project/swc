import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
// @target: es2015
var array = [];
for(var i = 0; i < 10; ++i){
    var method = function method() {};
    var get_accessor = function get_accessor() {
        return 42;
    };
    var set_accessor = function set_accessor(val) {};
    var _myField, _method, _accessor, _C;
    array.push((_myField = /*#__PURE__*/ new WeakMap(), _method = /*#__PURE__*/ new WeakSet(), _accessor = /*#__PURE__*/ new WeakMap(), _C = function C() {
        "use strict";
        _class_call_check(this, C);
        _class_private_method_init(this, _method);
        _class_private_field_init(this, _accessor, {
            get: get_accessor,
            set: set_accessor
        });
        _class_private_field_init(this, _myField, {
            writable: true,
            value: "hello"
        });
    }, _C));
}
