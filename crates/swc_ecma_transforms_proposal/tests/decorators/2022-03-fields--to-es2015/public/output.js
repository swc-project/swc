var _computedKey, _init_a, _init_b, _init__computedKey;
const dec = ()=>{};
_computedKey = 'c';
let _computedKey1 = _computedKey;
class Foo {
    constructor(){
        _define_property(this, "a", _init_a(this));
        _define_property(this, "b", _init_b(this, 123));
        _define_property(this, _computedKey1, _init__computedKey(this, 456));
    }
}
({ e: [_init_a, _init_b, _init__computedKey] } = _apply_decs_2203_r(Foo, [
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
], []));
