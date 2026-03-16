let _init_a, _init_extra_a, _init_b, _init_extra_b;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_extra_a, _init_b, _init_extra_b] } = _apply_decs_2311(this, [], [
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
    constructor(){
        _init_extra_b(this);
    }
    #a = _init_a(this);
    #b = (_init_extra_a(this), _init_b(this, 123));
}
