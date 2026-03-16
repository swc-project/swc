var _call_x, _initProto;
const dec = ()=>{};
class Foo extends Bar {
    static{
        ({ e: [_call_x, _initProto] } = _apply_decs_2311(this, [], [
            [
                dec,
                2,
                "x",
                function() {
                    return super.foo();
                }
            ]
        ], 0, (o)=>#x in o));
    }
    constructor(...args){
        super(...args), _initProto(this);
    }
    get #x() {
        return _call_x;
    }
}
