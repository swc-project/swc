//// [privateNameComputedPropertyName1.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _d = new WeakMap(), _e = new WeakMap();
class A {
    test() {
        const data = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            e: 'e'
        };
        const { [_class_private_field_get(this, _a)]: a, [_class_private_field_get(this, _b)]: b, [_class_private_field_get(this, _c)]: c, [_class_private_field_get(this, _d)]: d, [_class_private_field_set(this, _e, 'e')]: e } = data;
        console.log(a, b, c, d, e);
        const a1 = data[_class_private_field_get(this, _a)];
        const b1 = data[_class_private_field_get(this, _b)];
        const c1 = data[_class_private_field_get(this, _c)];
        const d1 = data[_class_private_field_get(this, _d)];
        const e1 = data[_class_private_field_get(this, _e)];
        console.log(a1, b1, c1, d1);
    }
    constructor(){
        _class_private_field_init(this, _a, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _b, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _c, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _d, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _e, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _a, 'a');
        _class_private_field_set(this, _c, 'c');
        _class_private_field_set(this, _e, '');
        _class_private_field_set(this, _b, 'b');
        _class_private_field_set(this, _d, 'd');
    }
}
new A().test();
