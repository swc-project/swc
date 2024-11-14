var _init_a, _init_b, _computedKey, _init_computedKey, _initStatic;
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
(()=>{
    ({ e: [_init_a, _init_b, _init_computedKey, _initStatic] } = _apply_decs_2203_r(Foo, [
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
})();
var ____private_a_1 = {
    writable: true,
    value: _init_a(Foo)
};
var ____private_b_2 = {
    writable: true,
    value: _init_b(Foo, 123)
};
var ____private_computedKey_3 = {
    writable: true,
    value: _init_computedKey(Foo, 456)
};
