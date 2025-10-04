var _init_a, _init_b, _init_computedKey;
const dec = ()=>{};
class Foo {
    constructor(){
        _define_property(this, "a", _init_a(this));
        _define_property(this, "b", _init_b(this, 123));
        _define_property(this, 'c', _init_computedKey(this, 456));
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
var __ = {
    writable: true,
    value: [_init_a, _init_b, _init_computedKey] = _apply_decs_2203_r(Foo, [
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
    ], []).e
};
