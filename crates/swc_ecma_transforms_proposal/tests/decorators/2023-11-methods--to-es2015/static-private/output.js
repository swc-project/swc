var _call_a, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_a, _initStatic] } = _apply_decs_2311(this, [], [
            [
                dec,
                10,
                "a",
                function() {
                    return this.value;
                }
            ]
        ]));
        _initStatic(this);
    }
    static value = 1;
    static get #a() {
        return _call_a;
    }
    static callA() {
        return this.#a();
    }
}
