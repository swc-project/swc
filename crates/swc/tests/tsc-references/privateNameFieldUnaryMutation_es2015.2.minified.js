import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_private_field_update from "@swc/helpers/lib/_class_private_field_update.js";
var _test = new WeakMap();
class C {
    test() {
        for(_class_private_field_update(this.getInstance(), _test).value++, _class_private_field_update(this.getInstance(), _test).value--, ++_class_private_field_update(this.getInstance(), _test).value, --_class_private_field_update(this.getInstance(), _test).value, _class_private_field_update(this.getInstance(), _test).value++, _class_private_field_update(this.getInstance(), _test).value--, ++_class_private_field_update(this.getInstance(), _test).value, --_class_private_field_update(this.getInstance(), _test).value, _class_private_field_set(this.getInstance(), _test, 0); 10 > _class_private_field_get(this.getInstance(), _test); ++_class_private_field_update(this.getInstance(), _test).value);
        for(_class_private_field_set(this.getInstance(), _test, 0); 10 > _class_private_field_get(this.getInstance(), _test); _class_private_field_update(this.getInstance(), _test).value++);
    }
    getInstance() {
        return new C();
    }
    constructor(){
        for(_class_private_field_init(this, _test, {
            writable: !0,
            value: 24
        }), _class_private_field_update(this, _test).value++, _class_private_field_update(this, _test).value--, ++_class_private_field_update(this, _test).value, --_class_private_field_update(this, _test).value, _class_private_field_update(this, _test).value++, _class_private_field_update(this, _test).value--, ++_class_private_field_update(this, _test).value, --_class_private_field_update(this, _test).value, _class_private_field_set(this, _test, 0); 10 > _class_private_field_get(this, _test); ++_class_private_field_update(this, _test).value);
        for(_class_private_field_set(this, _test, 0); 10 > _class_private_field_get(this, _test); _class_private_field_update(this, _test).value++);
    }
}
