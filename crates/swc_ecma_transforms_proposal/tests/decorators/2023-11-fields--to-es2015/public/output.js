var _computedKey, _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey;
const dec = ()=>{};
_computedKey = 'c';
let _computedKey1 = _computedKey;
class Foo {
    constructor(){
        _define_property(this, "a", (()=>{
            const _value = _init_a(this);
            _init_extra__init_a(this);
            return _value;
        })());
        _define_property(this, "b", (()=>{
            const _value = _init_b(this, 123);
            _init_extra__init_b(this);
            return _value;
        })());
        _define_property(this, _computedKey1, (()=>{
            const _value = _init__computedKey(this, 456);
            _init_extra__init__computedKey(this);
            return _value;
        })());
    }
}
({ e: [_init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey] } = _apply_decs_2311(Foo, [], [
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
