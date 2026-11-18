let _call_a, _call_a1, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_a, _call_a1, _initProto] } = _apply_decs_2311(this, [], [
            [
                dec,
                3,
                "a",
                function() {
                    return this.value;
                }
            ],
            [
                dec,
                4,
                "a",
                function(v) {
                    this.value = v;
                }
            ]
        ], 0, (o)=>#a in o));
    }
    value = (_initProto(this), 1);
    get #a() {
        return _call_a(this);
    }
    set #a(v) {
        return _call_a1(this, v);
    }
    getA() {
        return this.#a;
    }
    setA(v) {
        this.#a = v;
    }
}
