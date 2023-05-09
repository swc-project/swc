var _init_a, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _initProto]  } = _apply_decs_2203_r(this, [
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
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    a = _init_a(this, 123);
    a() {
        return 1;
    }
}
