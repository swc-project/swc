var _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_initProto]  } = _apply_decs_2203_r(this, [
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
        ], []));
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
