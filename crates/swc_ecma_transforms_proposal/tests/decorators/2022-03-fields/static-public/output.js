var _init_a, _init_b, _init_computedKey;
const dec = ()=>{};
class Foo {
    static{
        [_init_a, _init_b, _init_computedKey] = _apply_decs_2203_r(this, [
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
        ], []).e;
    }
    static a = _init_a(this);
    static b = _init_b(this, 123);
    static ['c'] = _init_computedKey(this, 456);
}
