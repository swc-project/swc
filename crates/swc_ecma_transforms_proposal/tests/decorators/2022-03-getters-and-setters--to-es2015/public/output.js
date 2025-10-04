var _initProto;
const dec = ()=>{};
class Foo {
    get a() {
        return this.value;
    }
    set a(v) {
        this.value = v;
    }
    get ['b']() {
        return this.value;
    }
    set ['b'](v) {
        this.value = v;
    }
    constructor(){
        _define_property(this, "value", (_initProto(this), 1));
    }
}
({ e: [_initProto] } = _apply_decs_2203_r(Foo, [
    [
        dec,
        3,
        "a"
    ],
    [
        dec,
        4,
        "a"
    ],
    [
        dec,
        3,
        _computedKey
    ],
    [
        dec,
        4,
        _computedKey1
    ]
], []));
var __ = {
    writable: true,
    value: [_initProto] = _apply_decs_2203_r(Foo, [
        [
            dec,
            3,
            "a"
        ],
        [
            dec,
            4,
            "a"
        ],
        [
            dec,
            3,
            'b'
        ],
        [
            dec,
            4,
            'b'
        ]
    ], []).e
};
