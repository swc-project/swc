let _dec, _dec1, _dec2, _dec3, _initClass, _dec4, _dec5, _dec6, _initProto;
const dec = ()=>{};
_dec = call(), _dec1 = chain.expr(), _dec2 = arbitrary + expr, _dec3 = array[expr], _dec4 = call(), _dec5 = chain.expr(), _dec6 = arbitrary + expr;
let _Foo, _Foo_member;
class Foo {
    static{
        ({ e: [_initProto], c: [_Foo, _initClass] } = _apply_decs_2311(this, [
            void 0,
            dec,
            void 0,
            _dec,
            void 0,
            _dec1,
            void 0,
            _dec2,
            array,
            _dec3
        ], [
            [
                [
                    void 0,
                    dec,
                    void 0,
                    _dec4,
                    void 0,
                    _dec5,
                    void 0,
                    _dec6,
                    array,
                    array[expr]
                ],
                18,
                "method"
            ]
        ], 1));
    }
    constructor(){
        _initProto(this);
    }
    #a;
    method() {}
    makeClass() {
        let _init_bar, _init_extra__init_bar;
        return class Nested {
            static{
                ({ e: [_init_bar, _init_extra__init_bar] } = _apply_decs_2311(this, [], [
                    [
                        [
                            this,
                            this.#a
                        ],
                        16,
                        "bar"
                    ]
                ]));
            }
            constructor(){
                _init_extra__init_bar(this);
            }
            bar = _init_bar(this);
        };
    }
    static{
        _initClass();
        _Foo_member = _Foo;
    }
}
