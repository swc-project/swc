let _computedKey, _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey;
const dec = ()=>{};
_computedKey = _to_property_key('c');
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey] } = _apply_decs_2311(this, [], [
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
    constructor(){
        _init_extra__init__computedKey(this);
    }
    a = _init_a(this);
    b = (_init_extra__init_a(this), _init_b(this, 123));
    [_computedKey] = (_init_extra__init_b(this), _init__computedKey(this, 456));
}
