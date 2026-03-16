let _computedKey, _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey;
const dec = ()=>{};
_computedKey = _to_property_key('c');
let _computedKey1 = _computedKey;
class Foo {
    constructor(){
        _define_property(this, "a", _init_a(this));
        _define_property(this, "b", (_init_extra__init_a(this), _init_b(this, 123)));
        _define_property(this, _computedKey1, (_init_extra__init_b(this), _init__computedKey(this, 456)));
        _init_extra__init__computedKey(this);
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
