import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
// @target: es6
class D {
}
var _x = /*#__PURE__*/ new WeakMap();
class C {
    foo() {
        const c = new C();
        _class_private_field_get(c, _x); // OK
        const d = new C();
        _class_private_field_get(d, _x); // Error
    }
    constructor(){
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
