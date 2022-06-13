import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
for(var array = [], i = 0; i < 10; ++i){
    var _myField, _method, _accessor, get_accessor = function() {
        return 42;
    }, set_accessor = function(val) {};
    array.push((_myField = new WeakMap(), _method = new WeakSet(), _accessor = new WeakMap(), function C() {
        "use strict";
        _class_call_check(this, C), _class_private_method_init(this, _method), _class_private_field_init(this, _accessor, {
            get: get_accessor,
            set: set_accessor
        }), _class_private_field_init(this, _myField, {
            writable: !0,
            value: "hello"
        });
    }));
}
