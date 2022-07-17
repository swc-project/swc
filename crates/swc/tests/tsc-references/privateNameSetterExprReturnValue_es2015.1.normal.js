// @target: es2019
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _foo = /*#__PURE__*/ new WeakMap();
class C {
    bar() {
        let x = _class_private_field_set(this, _foo, 42 * 2);
        console.log(x); // 84
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
