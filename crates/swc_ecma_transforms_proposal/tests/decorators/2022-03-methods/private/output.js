var _call_a, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_a, _initProto] } = _apply_decs_2203_r(this, [
            [
                dec,
                2,
                "a",
                function() {
                    return this.value;
                }
            ]
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    value = 1;
    get #a() {
        return _call_a;
    }
    callA() {
        return this.#a();
    }
}
