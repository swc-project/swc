import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
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
