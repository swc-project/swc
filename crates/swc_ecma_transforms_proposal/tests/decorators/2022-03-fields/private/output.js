var _init_a, _init_b;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_b]  } = _apply_decs_2203_r(this, [
            [
                dec,
                0,
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
                0,
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
    #a = _init_a(this);
    #b = _init_b(this, 123);
}
