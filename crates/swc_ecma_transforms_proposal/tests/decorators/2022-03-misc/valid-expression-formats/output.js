var _dec, _dec1, _dec2, _dec3, _initClass, _dec4, _dec5, _dec6, _dec7;
const dec = ()=>{};
let _Foo;
_dec = call(), _dec1 = chain.expr(), _dec2 = arbitrary + expr, _dec3 = array[expr], _dec4 = call(), _dec5 = chain.expr(), _dec6 = arbitrary + expr, _dec7 = array[expr];
class Foo {
    #a;
    method() {}
    makeClass() {
        var _dec8, _init_bar, _initProto;
        _dec8 = this.#a;
        return class Nested {
            static{
                ({ e: [_init_bar, _initProto] , c: [_Foo, _initClass]  } = _apply_decs_2203_r(this, [
                    [
                        [
                            dec,
                            _dec4,
                            _dec5,
                            _dec6,
                            _dec7
                        ],
                        2,
                        "method"
                    ]
                ], [
                    dec,
                    _dec,
                    _dec1,
                    _dec2,
                    _dec3
                ]));
            }
            constructor(){
                _initProto(this);
            }
            bar = _init_bar(this);
        };
    }
    static{
        _initClass();
    }
}
