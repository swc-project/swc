//// [privateNameComputedPropertyName1.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap(), _c = /*#__PURE__*/ new WeakMap(), _d = /*#__PURE__*/ new WeakMap(), _e = /*#__PURE__*/ new WeakMap();
new class {
    test() {
        let data = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            e: 'e'
        }, { [_class_private_field_get(this, _a)]: a, [_class_private_field_get(this, _b)]: b, [_class_private_field_get(this, _c)]: c, [_class_private_field_get(this, _d)]: d, [_class_private_field_set(this, _e, 'e')]: e } = data;
        console.log(a, b, c, d, e);
        let a1 = data[_class_private_field_get(this, _a)], b1 = data[_class_private_field_get(this, _b)], c1 = data[_class_private_field_get(this, _c)], d1 = data[_class_private_field_get(this, _d)];
        data[_class_private_field_get(this, _e)], console.log(a1, b1, c1, d1);
    }
    constructor(){
        _class_private_field_init(this, _a, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _b, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _c, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _d, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _e, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _a, 'a'), _class_private_field_set(this, _c, 'c'), _class_private_field_set(this, _e, ''), _class_private_field_set(this, _b, 'b'), _class_private_field_set(this, _d, 'd');
    }
}().test();
