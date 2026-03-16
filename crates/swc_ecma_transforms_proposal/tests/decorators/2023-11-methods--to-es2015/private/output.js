var _call_a, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_a, _initProto] } = _apply_decs_2311(this, [], [
            [
                dec,
                2,
                "a",
                function() {
                    return this.value;
                }
            ]
        ], 0, (o)=>#a in o));
    }
    value = (_initProto(this), 1);
    get #a() {
        return _call_a;
    }
    callA() {
        return this.#a();
    }
}
