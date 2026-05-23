var _computedKey, _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
}
({ e: [_init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey] } = _apply_decs_2203_r(Foo, [
    [
        dec,
        5,
        "a"
    ],
    [
        dec,
        5,
        "b"
    ],
    [
        dec,
        5,
        _computedKey
    ]
], []));
_define_property(Foo, "a", (()=>{
    const _value = _init_a(Foo);
    _init_extra__init_a(Foo);
    return _value;
})());
_define_property(Foo, "b", (()=>{
    const _value = _init_b(Foo, 123);
    _init_extra__init_b(Foo);
    return _value;
})());
_define_property(Foo, _computedKey, (()=>{
    const _value = _init__computedKey(Foo, 456);
    _init_extra__init__computedKey(Foo);
    return _value;
})());
