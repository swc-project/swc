var _dec, _dec1, _dec2, _initClass, _dec3, _dec4, _dec5, _initProto;
const dec = ()=>{};
let _Foo;
_dec = call(), _dec1 = chain.expr(), _dec2 = arbitrary + expr, _dec3 = call(), _dec4 = chain.expr(), _dec5 = arbitrary + expr;
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
            array[expr]
        ], [
            [
                [
                    void 0,
                    dec,
                    void 0,
                    _dec3,
                    void 0,
                    _dec4,
                    void 0,
                    _dec5,
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
        var _init_bar, _init_extra__init_bar;
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
            bar = (()=>{
                const _value = _init_bar(this);
                _init_extra__init_bar(this);
                return _value;
            })();
        };
    }
    static{
        _initClass();
    }
}
