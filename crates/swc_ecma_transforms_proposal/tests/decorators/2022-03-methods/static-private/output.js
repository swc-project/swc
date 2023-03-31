var _call_a, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        [_call_a, _initStatic] = _applyDecs2203R(this, [
            [
                dec,
                7,
                "a",
                function() {
                    return this.value;
                }
            ]
        ], []).e;
        _initStatic(this);
    }
    static value = 1;
    static #a = _call_a;
    static callA() {
        return this.#a();
    }
}
