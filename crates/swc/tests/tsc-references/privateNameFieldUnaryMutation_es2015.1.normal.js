// @target: es2015
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_field_update from "@swc/helpers/src/_class_private_field_update.mjs";
var _test = /*#__PURE__*/ new WeakMap();
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
