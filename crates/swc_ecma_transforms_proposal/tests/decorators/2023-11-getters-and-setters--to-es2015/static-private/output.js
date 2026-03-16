var _call_a, _call_a1, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_a, _call_a1, _initStatic] } = _apply_decs_2311(this, [], [
            [
                dec,
                11,
                "a",
                function() {
                    return this.value;
                }
            ],
            [
                dec,
                12,
                "a",
                function(v) {
                    this.value = v;
                }
            ]
        ]));
        _initStatic(this);
    }
    static value = 1;
    static get #a() {
        return _call_a(this);
    }
    static set #a(v) {
        return _call_a1(this, v);
    }
    static getA() {
        return this.#a;
    }
    static setA(v) {
        this.#a = v;
    }
}
