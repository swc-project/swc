var _call_x, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_x, _initProto] } = _apply_decs_2203_r(this, [
            [
                dec,
                2,
                "x",
                function() {}
            ]
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    get #x() {
        return _call_x;
    }
    bar() {
        this.#x++;
    }
}
