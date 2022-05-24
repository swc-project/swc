import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _value = new WeakMap();
new class {
    get value() {
        return _class_private_field_get(this, _value);
    }
    set value(value) {
        _class_private_field_set(this, _value, value);
    }
    constructor(initialValue){
        _class_private_field_init(this, _value, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _value, initialValue);
    }
}(3).value = 3;
