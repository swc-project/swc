var _init_a, _init_extra_a, _init_b, _init_extra_b, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_extra_a, _init_b, _init_extra_b, _initProto] } = _apply_decs_2311(this, [], [
            [
                dec,
                0,
                "a",
                function(_this) {
                    return _this.#a;
                },
                function(_this, value) {
                    _this.#a = value;
                }
            ],
            [
                dec,
                0,
                "b",
                function(_this) {
                    return _this.#b;
                },
                function(_this, value) {
                    _this.#b = value;
                }
            ]
        ], 0, (o)=>#a in o));
    }
    #a = (_initProto(this), (()=>{
        const _value = _init_a(this);
        _init_extra_a(this);
        return _value;
    })());
    #b = (()=>{
        const _value = _init_b(this, 123);
        _init_extra_b(this);
        return _value;
    })();
}
