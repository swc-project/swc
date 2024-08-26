var _init_a, _init_b, _init_computedKey;
const dec = ()=>{};
class Foo {
    static{
        [_init_a, _init_b, _init_computedKey] = _apply_decs_2203_r(this, [
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
                'c'
            ]
        ], []).e;
    }
    a = _init_a(this);
    b = _init_b(this, 123);
    ['c'] = _init_computedKey(this, 456);
}
