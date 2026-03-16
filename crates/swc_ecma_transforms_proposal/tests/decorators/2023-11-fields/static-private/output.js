var _init_a, _init_extra_a, _init_b, _init_extra_b, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_extra_a, _init_b, _init_extra_b, _initStatic] } = _apply_decs_2311(this, [], [
            [
                dec,
                8,
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
                8,
                "b",
                function(_this) {
                    return _this.#b;
                },
                function(_this, value) {
                    _this.#b = value;
                }
            ]
        ]));
        _initStatic(this);
    }
    static #a = (()=>{
        const _value = _init_a();
        _init_extra_a();
        return _value;
    })();
    static #b = (()=>{
        const _value = _init_b(123);
        _init_extra_b();
        return _value;
    })();
}
