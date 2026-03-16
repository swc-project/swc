var _init_a, _init_extra__init_a, _initProto;
const dec = ()=>{};
class Foo {
    a() {
        return 1;
    }
    constructor(){
        _define_property(this, "a", (_initProto(this), (()=>{
            const _value = _init_a(this, 123);
            _init_extra__init_a(this);
            return _value;
        })()));
    }
}
({ e: [_init_a, _init_extra__init_a, _initProto] } = _apply_decs_2311(Foo, [], [
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
]));
