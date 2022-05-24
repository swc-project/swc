import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _foo = /*#__PURE__*/ new WeakMap();
// @target: es2019
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
