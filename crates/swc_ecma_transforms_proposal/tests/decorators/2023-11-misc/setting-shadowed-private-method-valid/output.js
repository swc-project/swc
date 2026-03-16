let _call_x, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_x, _initProto] } = _apply_decs_2311(this, [], [
            [
                dec,
                2,
                "x",
                function() {
                    class Nested {
                        static #x;
                        static set x(v) {
                            this.#x = v;
                        }
                    }
                }
            ]
        ], 0, (o)=>#x in o));
    }
    constructor(){
        _initProto(this);
    }
    get #x() {
        return _call_x;
    }
}
