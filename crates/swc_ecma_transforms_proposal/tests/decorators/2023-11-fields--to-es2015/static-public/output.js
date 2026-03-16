var _computedKey, _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey, _initStatic;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
}
(()=>{
    ({ e: [_init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey, _initStatic] } = _apply_decs_2311(Foo, [], [
        [
            dec,
            8,
            "a"
        ],
        [
            dec,
            8,
            "b"
        ],
        [
            dec,
            8,
            _computedKey
        ]
    ]));
    _initStatic(Foo);
})();
_define_property(Foo, "a", (()=>{
    const _value = _init_a();
    _init_extra__init_a();
    return _value;
})());
_define_property(Foo, "b", (()=>{
    const _value = _init_b(123);
    _init_extra__init_b();
    return _value;
})());
_define_property(Foo, _computedKey, (()=>{
    const _value = _init__computedKey(456);
    _init_extra__init__computedKey();
    return _value;
})());
