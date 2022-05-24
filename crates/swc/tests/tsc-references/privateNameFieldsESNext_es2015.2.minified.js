import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
import _class_static_private_field_spec_set from "@swc/helpers/lib/_class_static_private_field_spec_set.js";
var _a = new WeakMap(), _b = new WeakMap(), _something = new WeakMap();
class C {
    method() {
        console.log(_class_private_field_get(this, _a)), _class_private_field_set(this, _a, "hello"), console.log(_class_private_field_get(this, _b));
    }
    static test() {
        console.log(_class_static_private_field_spec_get(this, C, _m)), console.log(_class_static_private_field_spec_set(this, C, _x, "test"));
    }
    constructor(){
        this.a = 123, _class_private_field_init(this, _a, {
            writable: !0,
            value: 10
        }), this.c = "hello", _class_private_field_init(this, _b, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _something, {
            writable: !0,
            value: ()=>1234
        });
    }
}
var _m = {
    writable: !0,
    value: "test"
}, _x = {
    writable: !0,
    value: void 0
};
