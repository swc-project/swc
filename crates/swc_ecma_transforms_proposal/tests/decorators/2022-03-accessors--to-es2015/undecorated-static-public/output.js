var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
let _computedKey1 = _computedKey, _computedKey2 = _computedKey;
class Foo {
    static get a() {
        return _class_static_private_field_spec_get(this, Foo, ____private_a);
    }
    static set a(_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_a, _v);
    }
    static get b() {
        return _class_static_private_field_spec_get(this, Foo, ____private_b);
    }
    static set b(_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_b, _v);
    }
    static get [_computedKey1]() {
        return _class_static_private_field_spec_get(this, Foo, ____private_computedKey);
    }
    static set [_computedKey2](_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_computedKey, _v);
    }
}
var ____private_a = {
    writable: true,
    value: void 0
};
var ____private_b = {
    writable: true,
    value: 123
};
var ____private_computedKey = {
    writable: true,
    value: 456
};
