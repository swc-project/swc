var _dec, _dec1, _dec2, _dec3, _initClass, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _initProto;
const dec = ()=>{};
let _Foo;
_dec = ()=>call(), _dec1 = ()=>chain.expr(), _dec2 = ()=>arbitrary + expr, _dec3 = ()=>array[expr], _dec4 = ()=>call(), _dec5 = ()=>chain.expr(), _dec6 = ()=>arbitrary + expr, _dec7 = ()=>array[expr], _dec8 = ()=>_dec4(), _dec9 = ()=>_dec5(), _dec10 = ()=>_dec6(), _dec11 = ()=>_dec7();
var _a = /*#__PURE__*/ new WeakMap();
class Foo {
    method() {}
    makeClass() {
        var _Nested, __;
        var _dec, _dec1, _init_bar;
        _dec = ()=>_class_private_field_get(this, _a), _dec1 = ()=>_dec();
        return _Nested = class Nested {
            constructor(){
                _define_property(this, "bar", _init_bar(this));
            }
        }, __ = {
            writable: true,
            value: { e: [_init_bar] } = _apply_decs_2203_r(_Nested, [
                [
                    _dec1(),
                    0,
                    "bar"
                ]
            ], [])
        }, _Nested;
    }
    constructor(){
        _class_private_field_init(this, _a, {
            writable: true,
            value: void 0
        });
        _initProto(this);
    }
}
var __ = {
    writable: true,
    value: { e: [_initProto], c: [_Foo, _initClass] } = _apply_decs_2203_r(Foo, [
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
    ])
};
var __1 = {
    writable: true,
    value: _initClass()
};
