var _dec, _initProto;
class A {
    static{
        _dec = A.test();
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                _dec,
                2,
                "hi"
            ]
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    static test(a, b) {}
    hi() {}
}
