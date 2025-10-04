var _initProto;
const dec = ()=>{};
class Foo {
    set a(v) {
        return this.value = v;
    }
    set ['b'](v) {
        return this.value = v;
    }
    constructor(){
        _define_property(this, "value", (_initProto(this), 1));
    }
}
({ e: [_initProto] } = _apply_decs_2203_r(Foo, [
    [
        dec,
        4,
        "a"
    ],
    [
        dec,
        4,
        _computedKey
    ]
], []));
var __ = {
    writable: true,
    value: [_initProto] = _apply_decs_2203_r(Foo, [
        [
            dec,
            4,
            "a"
        ],
        [
            dec,
            4,
            'b'
        ]
    ], []).e
};
