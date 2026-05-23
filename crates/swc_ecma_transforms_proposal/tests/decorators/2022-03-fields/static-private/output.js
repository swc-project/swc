var _init_a, _init_extra_a, _init_b, _init_extra_b;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_extra_a, _init_b, _init_extra_b] } = _apply_decs_2203_r(this, [
            [
                dec,
                5,
                "a",
                function() {
                    return this.#a;
                },
                function(value) {
                    this.#a = value;
                }
            ],
            [
                dec,
                5,
                "b",
                function() {
                    return this.#b;
                },
                function(value) {
                    this.#b = value;
                }
            ]
        ], []));
    }
    static #a = (()=>{
        const _value = _init_a(this);
        _init_extra_a(this);
        return _value;
    })();
    static #b = (()=>{
        const _value = _init_b(this, 123);
        _init_extra_b(this);
        return _value;
    })();
}
