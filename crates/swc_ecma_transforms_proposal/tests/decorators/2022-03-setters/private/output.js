var _call_a, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_a, _initProto] } = _apply_decs_2203_r(this, [
            [
                dec,
                4,
                "a",
                function(v) {
                    return this.value = v;
                }
            ]
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    value = 1;
    set #a(v) {
        return _call_a(this, v);
    }
    setA(v) {
        this.#a = v;
    }
}
