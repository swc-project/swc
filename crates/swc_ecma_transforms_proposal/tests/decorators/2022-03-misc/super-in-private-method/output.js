var _call_x, _initProto;
const dec = ()=>{};
class Foo extends Bar {
    static{
        [_call_x, _initProto] = _apply_decs_2203_r(this, [
            [
                dec,
                2,
                "x",
                function() {
                    return super.foo();
                }
            ]
        ], []).e;
    }
    constructor(...args){
        super(...args), _initProto(this);
    }
    get #x() {
        return _call_x;
    }
}
