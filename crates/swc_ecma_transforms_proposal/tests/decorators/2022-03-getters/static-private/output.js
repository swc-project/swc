var _call_a, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_a, _initStatic]  } = _apply_decs_2203_r(this, [
            [
                dec,
                8,
                "a",
                function() {
                    return this.value;
                }
            ]
        ], []));
        _initStatic(this);
    }
    static value = 1;
    static get #a() {
        return _call_a(this);
    }
    static getA() {
        return this.#a;
    }
}
