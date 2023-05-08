var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
var ____init_a = /*#__PURE__*/ new WeakMap(), ____init_b = /*#__PURE__*/ new WeakMap(), ____init_computedKey = /*#__PURE__*/ new WeakMap();
let _computedKey1 = _computedKey, _computedKey2 = _computedKey;
class Foo {
    get a() {
        return _class_private_field_get(this, ____init_a);
    }
    set a(_v) {
        _class_private_field_set(this, ____init_a, _v);
    }
    get b() {
        return _class_private_field_get(this, ____init_b);
    }
    set b(_v) {
        _class_private_field_set(this, ____init_b, _v);
    }
    get [_computedKey1]() {
        return _class_private_field_get(this, ____init_computedKey);
    }
    set [_computedKey2](_v) {
        _class_private_field_set(this, ____init_computedKey, _v);
    }
    constructor(){
        _class_private_field_init(this, ____init_a, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, ____init_b, {
            writable: true,
            value: 123
        });
        _class_private_field_init(this, ____init_computedKey, {
            writable: true,
            value: 456
        });
    }
}
