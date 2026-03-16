var _dec, _dec_this, _initProto;
let fn, obj;
_dec = fn(), _dec_this = obj.prop;
class A {
    static{
        ({ e: [_initProto] } = _apply_decs_2311(this, [], [
            [
                [
                    void 0,
                    _dec,
                    _dec_this,
                    _dec_this.foo
                ],
                18,
                "method"
            ]
        ]));
    }
    constructor(){
        _initProto(this);
    }
    method() {}
}
