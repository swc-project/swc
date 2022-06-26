import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _x = new WeakMap();
class C {
    foo() {
        let c = new C();
        _class_private_field_get(c, _x);
        let d = new C();
        _class_private_field_get(d, _x);
    }
    constructor(){
        _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
