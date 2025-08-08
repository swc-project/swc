var _initProto;
const dec = ()=>{};
class Foo {
    a() {
        return this.value;
    }
    ['b']() {
        return this.value;
    }
    constructor(){
        _define_property(this, "value", (_initProto(this), 1));
    }
}
({ e: [_initProto] } = _apply_decs_2203_r(Foo, [
    [
        dec,
        2,
        "a"
    ],
    [
        dec,
        2,
        _computedKey
    ]
], []));
var __ = {
    writable: true,
    value: [_initProto] = _apply_decs_2203_r(Foo, [
        [
            dec,
            2,
            "a"
        ],
        [
            dec,
            2,
            'b'
        ]
    ], []).e
};
