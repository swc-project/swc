var _init_a, _init_extra_a, _init_b, _init_extra_b;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _init_extra_a, _init_b, _init_extra_b] } = _apply_decs_2203_r(this, [
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
    constructor(){
        _init_extra_b(this);
    }
    #a = _init_a(this);
    #b = (_init_extra_a(this), _init_b(this, 123));
}
