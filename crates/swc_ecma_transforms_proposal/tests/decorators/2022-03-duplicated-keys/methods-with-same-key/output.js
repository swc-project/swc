var _initProto;
const dec = ()=>{};
class Foo {
    static{
        [_initProto] = _apply_decs_2203_r(this, [
            [
                dec,
                2,
                "a"
            ],
            [
                dec,
                2,
                "a"
            ]
        ], []).e;
    }
    constructor(){
        _initProto(this);
    }
    a() {
        return 1;
    }
    a() {
        return 2;
    }
}
