import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
let array = [];
for(let i = 0; i < 10; ++i){
    var _myField;
    function get_accessor() {
        return 42;
    }
    function set_accessor(val) {}
    array.push((_myField = new WeakMap(), class {
        constructor(){
            _class_private_method_init(this, new WeakSet()), _class_private_field_init(this, new WeakMap(), {
                get: get_accessor,
                set: set_accessor
            }), _class_private_field_init(this, _myField, {
                writable: !0,
                value: "hello"
            });
        }
    }));
}
