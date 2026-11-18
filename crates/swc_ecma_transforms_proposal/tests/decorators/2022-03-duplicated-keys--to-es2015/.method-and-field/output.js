var _init_a, _initProto;
const dec = ()=>{};
class Foo {
    a() {
        return 1;
    }
    constructor(){
        _define_property(this, "a", (_initProto(this), _init_a(this, 123)));
    }
}
({ e: [_init_a, _initProto] } = _apply_decs_2203_r(Foo, [
    [
        dec,
        2,
        "a"
    ],
    [
        dec,
        0,
        "a"
    ]
], []));
