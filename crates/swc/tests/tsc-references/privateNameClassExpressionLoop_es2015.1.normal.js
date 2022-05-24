import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
// @target: es2015
const array = [];
for(let i = 0; i < 10; ++i){
    var _myField, _method, _accessor, _C;
    array.push((_myField = /*#__PURE__*/ new WeakMap(), _method = /*#__PURE__*/ new WeakSet(), _accessor = /*#__PURE__*/ new WeakMap(), _C = class C {
        constructor(){
            _class_private_method_init(this, _method);
            _class_private_field_init(this, _accessor, {
                get: get_accessor,
                set: set_accessor
            });
            _class_private_field_init(this, _myField, {
                writable: true,
                value: "hello"
            });
        }
    }, _C));
    function method() {}
    function get_accessor() {
        return 42;
    }
    function set_accessor(val) {}
}
