//// [privateNameSetterExprReturnValue.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = /*#__PURE__*/ new WeakMap();
function set_foo(a) {}
new class {
    bar() {
        console.log(_class_private_field_set(this, _foo, 84));
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            get: void 0,
            set: set_foo
        });
    }
}().bar();
