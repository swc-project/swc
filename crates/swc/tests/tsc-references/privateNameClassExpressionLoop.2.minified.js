//// [privateNameClassExpressionLoop.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
let array = [];
for(let i = 0; i < 10; ++i){
    var _myField, _method, _accessor;
    function get_accessor() {
        return 42;
    }
    function set_accessor(val) {}
    array.push((_myField = new WeakMap(), _method = new WeakSet(), _accessor = new WeakMap(), class {
        constructor(){
            _class_private_method_init(this, _method), _class_private_field_init(this, _accessor, {
                get: get_accessor,
                set: set_accessor
            }), _class_private_field_init(this, _myField, {
                writable: !0,
                value: "hello"
            });
        }
    }));
}
