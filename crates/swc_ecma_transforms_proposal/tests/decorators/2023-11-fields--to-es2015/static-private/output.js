var _init_a, _init_b, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_b, _initStatic] } = _apply_decs_2311(this, [], [
            [
                dec,
                8,
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
                8,
                "b",
                function() {
                    return this.#b;
                },
                function(value) {
                    this.#b = value;
                }
            ]
        ]));
        _initStatic(this);
    }
    static #a = _init_a(this);
    static #b = _init_b(this, 123);
}
