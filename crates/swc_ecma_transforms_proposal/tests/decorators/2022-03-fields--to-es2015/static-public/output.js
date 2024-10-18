var _init_a, _init_b, _init_computedKey;
const dec = ()=>{};
class Foo {
}
var __ = {
    writable: true,
    value: [_init_a, _init_b, _init_computedKey] = _apply_decs_2203_r(Foo, [
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
            'c'
        ]
    ], []).e
};
_define_property(Foo, "a", _init_a(Foo));
_define_property(Foo, "b", _init_b(Foo, 123));
_define_property(Foo, 'c', _init_computedKey(Foo, 456));
