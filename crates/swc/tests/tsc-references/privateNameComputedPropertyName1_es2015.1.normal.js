import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap(), _c = /*#__PURE__*/ new WeakMap(), _d = /*#__PURE__*/ new WeakMap(), _e = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022, es2015
class A {
    test() {
        const data = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            e: 'e'
        };
        const { [_class_private_field_get(this, _a)]: a , [_class_private_field_get(this, _b)]: b , [_class_private_field_get(this, _c)]: c , [_class_private_field_get(this, _d)]: d , [_class_private_field_set(this, _e, 'e')]: e ,  } = data;
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
            value: 'a'
        });
        _class_private_field_init(this, _b, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _c, {
            writable: true,
            value: 'c'
        });
        _class_private_field_init(this, _d, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _e, {
            writable: true,
            value: ''
        });
        _class_private_field_set(this, _b, 'b');
        _class_private_field_set(this, _d, 'd');
    }
}
new A().test();
