var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
var ____private_a = /*#__PURE__*/ new WeakMap(), ____private_b = /*#__PURE__*/ new WeakMap(), ____private_computedKey = /*#__PURE__*/ new WeakMap();
let _computedKey1 = _computedKey, _computedKey2 = _computedKey;
class Foo {
    get a() {
        return _class_private_field_get(this, ____private_a);
    }
    set a(_v) {
        _class_private_field_set(this, ____private_a, _v);
    }
    get b() {
        return _class_private_field_get(this, ____private_b);
    }
    set b(_v) {
        _class_private_field_set(this, ____private_b, _v);
    }
    get [_computedKey1]() {
        return _class_private_field_get(this, ____private_computedKey);
    }
    set [_computedKey2](_v) {
        _class_private_field_set(this, ____private_computedKey, _v);
    }
    constructor(){
        _class_private_field_init(this, ____private_a, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, ____private_b, {
            writable: true,
            value: 123
        });
        _class_private_field_init(this, ____private_computedKey, {
            writable: true,
            value: 456
        });
    }
}
