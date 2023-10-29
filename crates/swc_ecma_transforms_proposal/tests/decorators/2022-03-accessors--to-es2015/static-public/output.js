var _init_a, _init_b, _computedKey, _init_computedKey, _initStatic;
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
var __ = {
    writable: true,
    value: (()=>{
        ({ e: [_init_a, _init_b, _init_computedKey, _initStatic]  } = _apply_decs_2203_r(Foo, [
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
                _computedKey
            ]
        ], []));
        _initStatic(Foo);
    })()
};
var ____private_a = {
    writable: true,
    value: _init_a(Foo)
};
var ____private_b = {
    writable: true,
    value: _init_b(Foo, 123)
};
var ____private_computedKey = {
    writable: true,
    value: _init_computedKey(Foo, 456)
};
