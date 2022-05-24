import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
import _class_static_private_field_spec_set from "@swc/helpers/lib/_class_static_private_field_spec_set.js";
import _class_static_private_field_update from "@swc/helpers/lib/_class_static_private_field_update.js";
// @target: es2015
class C {
    test() {
        _class_static_private_field_update(this.getClass(), C, _test).value++;
        _class_static_private_field_update(this.getClass(), C, _test).value--;
        ++_class_static_private_field_update(this.getClass(), C, _test).value;
        --_class_static_private_field_update(this.getClass(), C, _test).value;
        const a = _class_static_private_field_update(this.getClass(), C, _test).value++;
        const b = _class_static_private_field_update(this.getClass(), C, _test).value--;
        const c = ++_class_static_private_field_update(this.getClass(), C, _test).value;
        const d = --_class_static_private_field_update(this.getClass(), C, _test).value;
        for(_class_static_private_field_spec_set(this.getClass(), C, _test, 0); _class_static_private_field_spec_get(this.getClass(), C, _test) < 10; ++_class_static_private_field_update(this.getClass(), C, _test).value){}
        for(_class_static_private_field_spec_set(this.getClass(), C, _test, 0); _class_static_private_field_spec_get(this.getClass(), C, _test) < 10; _class_static_private_field_update(this.getClass(), C, _test).value++){}
    }
    getClass() {
        return C;
    }
    constructor(){
        _class_static_private_field_update(C, C, _test).value++;
        _class_static_private_field_update(C, C, _test).value--;
        ++_class_static_private_field_update(C, C, _test).value;
        --_class_static_private_field_update(C, C, _test).value;
        const a = _class_static_private_field_update(C, C, _test).value++;
        const b = _class_static_private_field_update(C, C, _test).value--;
        const c = ++_class_static_private_field_update(C, C, _test).value;
        const d = --_class_static_private_field_update(C, C, _test).value;
        for(_class_static_private_field_spec_set(C, C, _test, 0); _class_static_private_field_spec_get(C, C, _test) < 10; ++_class_static_private_field_update(C, C, _test).value){}
        for(_class_static_private_field_spec_set(C, C, _test, 0); _class_static_private_field_spec_get(C, C, _test) < 10; _class_static_private_field_update(C, C, _test).value++){}
    }
}
var _test = {
    writable: true,
    value: 24
};
