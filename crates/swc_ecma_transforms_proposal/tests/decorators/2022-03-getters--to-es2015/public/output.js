var _initProto;
const dec = ()=>{};
class Foo {
    get a() {
        return this.value;
    }
    get ['b']() {
        return this.value;
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
        3,
        _computedKey
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
            3,
            'b'
        ]
    ], []).e
};
