var _computedKey, _init_a, _init_b, _init__computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static{
        ({ e: [_init_a, _init_b, _init__computedKey, _initProto] } = _apply_decs_2203_r(this, [
            [
                dec,
                0,
                "a"
            ],
            [
                dec,
                0,
                "b"
            ],
            [
                dec,
                0,
                _computedKey
            ]
        ], []));
    }
    a = (_initProto(this), _init_a(this));
    b = _init_b(this, 123);
    [_computedKey] = _init__computedKey(this, 456);
}
