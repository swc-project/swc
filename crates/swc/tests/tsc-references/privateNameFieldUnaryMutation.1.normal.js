//// [privateNameFieldUnaryMutation.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_field_update from "@swc/helpers/src/_class_private_field_update.mjs";
var _test = /*#__PURE__*/ new WeakMap();
class C {
    test() {
        var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _ref12, _ref13;
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
        _class_private_field_get(_ref2 = this.getInstance(), _test)++;
        _class_private_field_get(_ref3 = this.getInstance(), _test)--;
        ++_class_private_field_get(_ref4 = this.getInstance(), _test);
        --_class_private_field_get(_ref5 = this.getInstance(), _test);
        const e = _class_private_field_get(_ref6 = this.getInstance(), _test)++;
        const f = _class_private_field_get(_ref7 = this.getInstance(), _test)--;
        const g = ++_class_private_field_get(_ref8 = this.getInstance(), _test);
        const h = --_class_private_field_get(_ref9 = this.getInstance(), _test);
        for(_class_private_field_set(this.getInstance(), _test, 0); _class_private_field_get(_ref10 = this.getInstance(), _test) < 10; ++_class_private_field_get(_ref11 = this.getInstance(), _test)){}
        for(_class_private_field_set(this.getInstance(), _test, 0); _class_private_field_get(_ref12 = this.getInstance(), _test) < 10; _class_private_field_get(_ref13 = this.getInstance(), _test)++){}
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
        _class_private_field_get(this, _test)++;
        _class_private_field_get(this, _test)--;
        ++_class_private_field_get(this, _test);
        --_class_private_field_get(this, _test);
        const e = _class_private_field_get(this, _test)++;
        const f = _class_private_field_get(this, _test)--;
        const g = ++_class_private_field_get(this, _test);
        const h = --_class_private_field_get(this, _test);
        for(_class_private_field_set(this, _test, 0); _class_private_field_get(this, _test) < 10; ++_class_private_field_get(this, _test)){}
        for(_class_private_field_set(this, _test, 0); _class_private_field_get(this, _test) < 10; _class_private_field_get(this, _test)++){}
    }
}
