//// [privateNameFieldUnaryMutation.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _class_private_field_update } from "@swc/helpers/_/_class_private_field_update";
var _test = /*#__PURE__*/ new WeakMap();
class C {
    test() {
        var _this_getInstance, _this_getInstance1, _this_getInstance2, _this_getInstance3;
        _class_private_field_update(this.getInstance(), _test).value++;
        _class_private_field_update(this.getInstance(), _test).value--;
        ++_class_private_field_update(this.getInstance(), _test).value;
        --_class_private_field_update(this.getInstance(), _test).value;
        const a = _class_private_field_update(this.getInstance(), _test).value++;
        const b = _class_private_field_update(this.getInstance(), _test).value--;
        const c = ++_class_private_field_update(this.getInstance(), _test).value;
        const d = --_class_private_field_update(this.getInstance(), _test).value;
        for(_class_private_field_set(this.getInstance(), _test, 0); _class_private_field_get(_this_getInstance = this.getInstance(), _test) < 10; ++_class_private_field_update(this.getInstance(), _test).value){}
        for(_class_private_field_set(this.getInstance(), _test, 0); _class_private_field_get(_this_getInstance1 = this.getInstance(), _test) < 10; _class_private_field_update(this.getInstance(), _test).value++){}
        _class_private_field_update(this.getInstance(), _test).value++;
        _class_private_field_update(this.getInstance(), _test).value--;
        ++_class_private_field_update(this.getInstance(), _test).value;
        --_class_private_field_update(this.getInstance(), _test).value;
        const e = _class_private_field_update(this.getInstance(), _test).value++;
        const f = _class_private_field_update(this.getInstance(), _test).value--;
        const g = ++_class_private_field_update(this.getInstance(), _test).value;
        const h = --_class_private_field_update(this.getInstance(), _test).value;
        for(_class_private_field_set(this.getInstance(), _test, 0); _class_private_field_get(_this_getInstance2 = this.getInstance(), _test) < 10; ++_class_private_field_update(this.getInstance(), _test).value){}
        for(_class_private_field_set(this.getInstance(), _test, 0); _class_private_field_get(_this_getInstance3 = this.getInstance(), _test) < 10; _class_private_field_update(this.getInstance(), _test).value++){}
    }
    getInstance() {
        return new C();
    }
    constructor(){
        _class_private_field_init(this, _test, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _test, 24);
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
        _class_private_field_update(this, _test).value++;
        _class_private_field_update(this, _test).value--;
        ++_class_private_field_update(this, _test).value;
        --_class_private_field_update(this, _test).value;
        const e = _class_private_field_update(this, _test).value++;
        const f = _class_private_field_update(this, _test).value--;
        const g = ++_class_private_field_update(this, _test).value;
        const h = --_class_private_field_update(this, _test).value;
        for(_class_private_field_set(this, _test, 0); _class_private_field_get(this, _test) < 10; ++_class_private_field_update(this, _test).value){}
        for(_class_private_field_set(this, _test, 0); _class_private_field_get(this, _test) < 10; _class_private_field_update(this, _test).value++){}
    }
}
