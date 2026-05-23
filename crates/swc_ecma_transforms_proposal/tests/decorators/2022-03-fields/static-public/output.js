var _computedKey, _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey] } = _apply_decs_2203_r(this, [
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
    static a = (()=>{
        const _value = _init_a(this);
        _init_extra__init_a(this);
        return _value;
    })();
    static b = (()=>{
        const _value = _init_b(this, 123);
        _init_extra__init_b(this);
        return _value;
    })();
    static [_computedKey] = (()=>{
        const _value = _init__computedKey(this, 456);
        _init_extra__init__computedKey(this);
        return _value;
    })();
}
