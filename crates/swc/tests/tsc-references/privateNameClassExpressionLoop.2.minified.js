//// [privateNameClassExpressionLoop.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
let array = [];
for(let i = 0; i < 10; ++i){
    var _myField = new WeakMap(), _method = new WeakSet(), _accessor = new WeakMap();
    array.push(class {
        constructor(){
            _method.add(this), _accessor.set(this, {
                get: get_accessor,
                set: set_accessor
            }), _class_private_field_init(this, _myField, {
                writable: !0,
                value: void 0
            }), _class_private_field_set(this, _myField, "hello");
        }
    });
}
