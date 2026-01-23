var _init_a, _init_b, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_b, _initStatic] } = _apply_decs_2203_r(this, [
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
        _initStatic(this);
    }
    static #a = _init_a(this);
    static #b = _init_b(this, 123);
}
