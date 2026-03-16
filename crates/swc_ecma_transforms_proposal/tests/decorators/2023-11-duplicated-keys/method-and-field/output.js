var _init_a, _init_extra__init_a, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _initProto] } = _apply_decs_2311(this, [], [
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
    }
    a = (_initProto(this), (()=>{
        const _value = _init_a(this, 123);
        _init_extra__init_a(this);
        return _value;
    })());
    a() {
        return 1;
    }
}
