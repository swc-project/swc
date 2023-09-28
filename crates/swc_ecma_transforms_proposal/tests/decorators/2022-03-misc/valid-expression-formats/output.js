var _dec, _dec1, _dec2, _dec3, _initClass, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _initProto;
const dec = ()=>{};
let _Foo;
_dec = ()=>call(), _dec1 = ()=>chain.expr(), _dec2 = ()=>arbitrary + expr, _dec3 = ()=>array[expr], _dec4 = ()=>call(), _dec5 = ()=>chain.expr(), _dec6 = ()=>arbitrary + expr, _dec7 = ()=>array[expr], _dec8 = ()=>_dec4(), _dec9 = ()=>_dec5(), _dec10 = ()=>_dec6(), _dec11 = ()=>_dec7();
class Foo {
    static{
        ({ e: [_initProto], c: [_Foo, _initClass] } = _apply_decs_2203_r(this, [
            [
                [
                    dec,
                    _dec8(),
                    _dec9(),
                    _dec10(),
                    _dec11()
                ],
                2,
                "method"
            ]
        ], [
            dec,
            _dec(),
            _dec1(),
            _dec2(),
            _dec3()
        ]));
    }
    constructor(){
        _initProto(this);
    }
    #a;
    method() {}
    makeClass() {
        var _dec, _dec1, _init_bar;
        _dec = ()=>this.#a, _dec1 = ()=>_dec();
        return class Nested {
            static{
                ({ e: [_init_bar] } = _apply_decs_2203_r(this, [
                    [
                        _dec1(),
                        0,
                        "bar"
                    ]
                ], []));
            }
            bar = _init_bar(this);
        };
    }
    static{
        _initClass();
    }
}
