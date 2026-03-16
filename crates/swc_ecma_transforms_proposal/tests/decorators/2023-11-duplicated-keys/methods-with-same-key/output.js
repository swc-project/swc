let _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_initProto] } = _apply_decs_2311(this, [], [
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
        ]));
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
