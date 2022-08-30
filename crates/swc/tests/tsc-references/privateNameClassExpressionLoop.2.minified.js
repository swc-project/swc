//// [privateNameClassExpressionLoop.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
let array = [];
for(let i = 0; i < 10; ++i){
    function get_accessor() {
        return 42;
    }
    function set_accessor(val) {}
    array.push(class {
        constructor(){
            _class_private_method_init(this, new WeakSet()), _class_private_field_init(this, new WeakMap(), {
                get: get_accessor,
                set: set_accessor
            }), _class_private_field_init(this, new WeakMap(), {
                writable: !0,
                value: "hello"
            });
        }
    });
}
