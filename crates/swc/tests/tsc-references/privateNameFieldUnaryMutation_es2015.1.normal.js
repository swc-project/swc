import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_private_field_update from "@swc/helpers/lib/_class_private_field_update.js";
var _test = /*#__PURE__*/ new WeakMap();
// @target: es2015
class C {
    test() {
        var _ref, _ref1;
        _class_private_field_update(this.getInstance(), _test).value++;
        _class_private_field_update(this.getInstance(), _test).value--;
        ++_class_private_field_update(this.getInstance(), _test).value;
        --_class_private_field_update(this.getInstance(), _test).value;
        const a = _class_private_field_update(this.getInstance(), _test).value++;
        const b = _class_private_field_update(this.getInstance(), _test).value--;
        const c = ++_class_private_field_update(this.getInstance(), _test).value;
        const d = --_class_private_field_update(this.getInstance(), _test).value;
        for(_class_private_field_set(this.getInstance(), _test, 0); _class_private_field_get(_ref = this.getInstance(), _test) < 10; ++_class_private_field_update(this.getInstance(), _test).value){}
        for(_class_private_field_set(this.getInstance(), _test, 0); _class_private_field_get(_ref1 = this.getInstance(), _test) < 10; _class_private_field_update(this.getInstance(), _test).value++){}
    }
    getInstance() {
        return new C();
    }
    constructor(){
        _class_private_field_init(this, _test, {
            writable: true,
            value: 24
        });
        _class_private_field_update(this, _test).value++;
        _class_private_field_update(this, _test).value--;
        ++_class_private_field_update(this, _test).value;
        --_class_private_field_update(this, _test).value;
        const a = _class_private_field_update(this, _test).value++;
        const b = _class_private_field_update(this, _test).value--;
        const c = ++_class_private_field_update(this, _test).value;
        const d = --_class_private_field_update(this, _test).value;
        for(_class_private_field_set(this, _test, 0); _class_private_field_get(this, _test) < 10; ++_class_private_field_update(this, _test).value){}
        for(_class_private_field_set(this, _test, 0); _class_private_field_get(this, _test) < 10; _class_private_field_update(this, _test).value++){}
    }
}
