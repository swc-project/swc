var _init_a, _initProto;
const dec = ()=>{};
class Foo {
    static{
        [_init_a, _initProto] = _apply_decs_2203_r(this, [
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
        ], []).e;
    }
    constructor(){
        _initProto(this);
    }
    a = _init_a(this, 123);
    a() {
        return 1;
    }
}
