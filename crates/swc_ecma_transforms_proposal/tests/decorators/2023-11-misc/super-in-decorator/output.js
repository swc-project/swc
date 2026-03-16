class A extends B {
    m() {
        let _dec, _initClass, _dec1, _initProto;
        _dec = super.dec1, _dec1 = super.dec2;
        let _C, _C_member;
        class C {
            static{
                ({ e: [_initProto], c: [_C, _initClass] } = _apply_decs_2311(this, [
                    _dec
                ], [
                    [
                        _dec1,
                        2,
                        "m2"
                    ]
                ]));
            }
            constructor(){
                _initProto(this);
            }
            m2() {}
            static{
                _initClass();
                _C_member = _C;
            }
        }
    }
}
