var _computedKey, _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey, _initProto] } = _apply_decs_2311(this, [], [
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
        ]));
    }
    a = (_initProto(this), (()=>{
        const _value = _init_a(this);
        _init_extra__init_a(this);
        return _value;
    })());
    b = (()=>{
        const _value = _init_b(this, 123);
        _init_extra__init_b(this);
        return _value;
    })();
    [_computedKey] = (()=>{
        const _value = _init__computedKey(this, 456);
        _init_extra__init__computedKey(this);
        return _value;
    })();
}
