import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _a = new WeakMap(), _b = new WeakSet(), _c = new WeakMap();
export class C {
    constructor(){
        _class_private_method_init(this, _b), _class_private_field_init(this, _c, {
            get: void 0,
            set: function(v) {
                _class_private_field_set(this, _a, _class_private_field_get(this, _a) + v);
            }
        }), _class_private_field_init(this, _a, {
            writable: !0,
            value: 1
        });
    }
}
