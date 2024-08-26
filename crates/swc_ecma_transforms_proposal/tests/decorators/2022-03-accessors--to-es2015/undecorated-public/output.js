const dec = ()=>{};
var ____private_a_1 = /*#__PURE__*/ new WeakMap(), ____private_b_2 = /*#__PURE__*/ new WeakMap(), ____private_computedKey_3 = /*#__PURE__*/ new WeakMap();
class Foo {
    get a() {
        return _class_private_field_get(this, ____private_a_1);
    }
    set a(_v) {
        _class_private_field_set(this, ____private_a_1, _v);
    }
    get b() {
        return _class_private_field_get(this, ____private_b_2);
    }
    set b(_v) {
        _class_private_field_set(this, ____private_b_2, _v);
    }
    get ['c']() {
        return _class_private_field_get(this, ____private_computedKey_3);
    }
    set ['c'](_v) {
        _class_private_field_set(this, ____private_computedKey_3, _v);
    }
    constructor(){
        _class_private_field_init(this, ____private_a_1, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, ____private_b_2, {
            writable: true,
            value: 123
        });
        _class_private_field_init(this, ____private_computedKey_3, {
            writable: true,
            value: 456
        });
    }
}
