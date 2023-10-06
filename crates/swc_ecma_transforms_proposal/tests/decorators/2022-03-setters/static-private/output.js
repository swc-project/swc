var _call_a, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_a, _initStatic] } = _apply_decs_2203_r(this, [
            [
                dec,
                9,
                "a",
                function(v) {
                    return this.value = v;
                }
            ]
        ], []));
        _initStatic(this);
    }
    static value = 1;
    static set #a(v) {
        return _call_a(this, v);
    }
    static setA(v) {
        this.#a = v;
    }
}
