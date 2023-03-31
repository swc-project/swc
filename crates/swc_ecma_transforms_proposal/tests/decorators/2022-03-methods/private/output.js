var _call_a, _initProto;
const dec = ()=>{};
class Foo {
    static{
        [_call_a, _initProto] = _applyDecs2203R(this, [
            [
                [
                    dec,
                    2,
                    "a",
                    function() {
                        return this.value;
                    }
                ]
            ]
        ], []).e;
    }
    constructor(){
        _initProto(this);
    }
    value = 1;
    #a = _call_a;
    callA() {
        return this.#a();
    }
}
