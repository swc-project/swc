var _computedKey, _init_a, _init_b, _init__computedKey;
const dec = ()=>{};
class Foo {
}
var __ = {
    writable: true,
    value: (()=>{
        _computedKey = 'c';
        ({ e: [_init_a, _init_b, _init__computedKey] } = _apply_decs_2203_r(Foo, [
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
    })()
};
_define_property(Foo, "a", _init_a(Foo));
_define_property(Foo, "b", _init_b(Foo, 123));
_define_property(Foo, _computedKey, _init__computedKey(Foo, 456));
