let _init_a, _init_extra__init_a, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _initProto] } = _apply_decs_2311(this, [], [
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
    }
    constructor(){
        _init_extra__init_a(this);
    }
    a = (_initProto(this), _init_a(this, 123));
    a() {
        return 1;
    }
}
