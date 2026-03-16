let _init_a, _init_extra__init_a, _initProto;
const dec = ()=>{};
class Foo {
    a() {
        return 1;
    }
    constructor(){
        _define_property(this, "a", (_initProto(this), _init_a(this, 123)));
        _init_extra__init_a(this);
    }
}
({ e: [_init_a, _init_extra__init_a, _initProto] } = _apply_decs_2311(Foo, [], [
    [
        dec,
        0,
        "a"
    ],
    [
        dec,
        2,
        "a"
    ]
]));
