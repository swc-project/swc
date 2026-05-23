var _init_a, _init_extra__init_a, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _initProto] } = _apply_decs_2203_r(this, [
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
    }
    constructor(){
        _init_extra__init_a(this);
    }
    a = (_initProto(this), _init_a(this, 123));
    a() {
        return 1;
    }
}
