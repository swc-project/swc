var _dec, _dec1, _dec2, _dec3, _initClass, _dec4, _dec5, _dec6, _dec7, _initProto;
const dec = ()=>{};
let _Foo;
_dec = call(), _dec1 = chain.expr(), _dec2 = arbitrary + expr, _dec3 = array[expr], _dec4 = call(), _dec5 = chain.expr(), _dec6 = arbitrary + expr, _dec7 = array[expr];
var _a = /*#__PURE__*/ new WeakMap();
class Foo {
    method() {}
    makeClass() {
        var _Nested;
        var _dec, _init_bar;
        _dec = _class_private_field_get(this, _a);
        return _Nested = class Nested {
            constructor(){
                _define_property(this, "bar", _init_bar(this));
            }
        }, { e: [_init_bar] } = _apply_decs_2203_r(_Nested, [
            [
                _dec,
                0,
                "bar"
            ]
        ], []), _Nested;
    }
    constructor(){
        _class_private_field_init(this, _a, {
            writable: true,
            value: void 0
        });
        _initProto(this);
    }
}
({ e: [_initProto], c: [_Foo, _initClass] } = _apply_decs_2203_r(Foo, [
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
_initClass();
