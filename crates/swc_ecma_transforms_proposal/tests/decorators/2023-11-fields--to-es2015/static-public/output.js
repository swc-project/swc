var _computedKey, _init_a, _init_b, _init__computedKey, _initStatic;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static{
        ({ e: [_init_a, _init_b, _init__computedKey, _initStatic] } = _apply_decs_2311(this, [], [
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
        _initStatic(this);
    }
    static a = _init_a(this);
    static b = _init_b(this, 123);
    static [_computedKey] = _init__computedKey(this, 456);
}
