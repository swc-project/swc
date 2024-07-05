var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
let _computedKey1 = _computedKey, _computedKey2 = _computedKey;
class Foo {
    static get a() {
        return _class_static_private_field_spec_get(this, Foo, ____private_a_1);
    }
    static set a(_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_a_1, _v);
    }
    static get b() {
        return _class_static_private_field_spec_get(this, Foo, ____private_b_2);
    }
    static set b(_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_b_2, _v);
    }
    static get [_computedKey1]() {
        return _class_static_private_field_spec_get(this, Foo, ____private_computedKey_3);
    }
    static set [_computedKey2](_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_computedKey_3, _v);
    }
}
var ____private_a_1 = {
    writable: true,
    value: void 0
};
var ____private_b_2 = {
    writable: true,
    value: 123
};
var ____private_computedKey_3 = {
    writable: true,
    value: 456
};
