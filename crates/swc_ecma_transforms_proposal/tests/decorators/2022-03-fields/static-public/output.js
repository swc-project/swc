var _computedKey, _init_a, _init_b, _init__computedKey;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static{
        ({ e: [_init_a, _init_b, _init__computedKey]  } = _apply_decs_2203_r(this, [
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
    }
    static a = _init_a(this);
    static b = _init_b(this, 123);
    static [_computedKey] = _init__computedKey(this, 456);
}
