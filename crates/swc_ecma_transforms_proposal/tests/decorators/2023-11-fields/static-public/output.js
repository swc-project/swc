var _computedKey, _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey] } = _apply_decs_2311(this, [], [
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
    }
    static a = (()=>{
        const _value = _init_a();
        _init_extra__init_a();
        return _value;
    })();
    static b = (()=>{
        const _value = _init_b(123);
        _init_extra__init_b();
        return _value;
    })();
    static [_computedKey] = (()=>{
        const _value = _init__computedKey(456);
        _init_extra__init__computedKey();
        return _value;
    })();
}
