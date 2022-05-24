import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
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
