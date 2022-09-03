//// [privateNameSetterExprReturnValue.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _foo = new WeakMap();
class C {
    bar() {
        let x = _class_private_field_set(this, _foo, 84);
        console.log(x);
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            get: void 0,
            set: set_foo
        });
    }
}
function set_foo(a) {}
new C().bar();
