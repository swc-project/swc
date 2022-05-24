import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _x = new WeakMap();
class C {
    static test() {
        _class_private_field_set(new C(), _x, 10);
        let y = new C(), z = new y();
        z.x = 123;
    }
    constructor(){
        _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
