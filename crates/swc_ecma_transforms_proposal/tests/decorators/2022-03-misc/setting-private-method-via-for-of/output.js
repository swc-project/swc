var _call_x, _initProto;
const dec = ()=>{};
class Foo {
    static{
        [_call_x, _initProto] = _apply_decs_2203_r(this, [
            [
                dec,
                2,
                "x",
                function() {}
            ]
        ], []).e;
    }
    constructor(){
        _initProto(this);
    }
    get #x() {
        return _call_x;
    }
    bar() {
        for (this.#x of this.baz);
    }
}
