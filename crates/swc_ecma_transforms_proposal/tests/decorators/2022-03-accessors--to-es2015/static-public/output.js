var _init_a, _init_b, _init_computedKey, _initStatic;
const dec = ()=>{};
class Foo {
    static get a() {
        return _class_static_private_field_spec_get(this, Foo, __private_a_1);
    }
    static set a(_v) {
        _class_static_private_field_spec_set(this, Foo, __private_a_1, _v);
    }
    static get b() {
        return _class_static_private_field_spec_get(this, Foo, __private_b_2);
    }
    static set b(_v) {
        _class_static_private_field_spec_set(this, Foo, __private_b_2, _v);
    }
    static get ['c']() {
        return _class_static_private_field_spec_get(this, Foo, __private_computedKey_3);
    }
    static set ['c'](_v) {
        _class_static_private_field_spec_set(this, Foo, __private_computedKey_3, _v);
    }
}
var __ = {
    writable: true,
    value: (()=>{
        [_init_a, _init_b, _init_computedKey, _initStatic] = _apply_decs_2203_r(Foo, [
            [
                dec,
                6,
                "a"
            ],
            [
                dec,
                6,
                "b"
            ],
            [
                dec,
                6,
                'c'
            ]
        ], []).e;
        _initStatic(Foo);
    })()
};
var __private_a_1 = {
    writable: true,
    value: _init_a(Foo)
};
var __private_b_2 = {
    writable: true,
    value: _init_b(Foo, 123)
};
var __private_computedKey_3 = {
    writable: true,
    value: _init_computedKey(Foo, 456)
};
