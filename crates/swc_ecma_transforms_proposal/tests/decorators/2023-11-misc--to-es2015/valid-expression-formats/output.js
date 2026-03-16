var _dec, _dec1, _dec2, _initClass, _dec3, _dec4, _dec5, _initProto;
const dec = ()=>{};
let _Foo;
_dec = call(), _dec1 = chain.expr(), _dec2 = arbitrary + expr, _dec3 = call(), _dec4 = chain.expr(), _dec5 = arbitrary + expr;
var _a = /*#__PURE__*/ new WeakMap();
class Foo {
    method() {}
    makeClass() {
        var _Nested;
        var _init_bar, _init_extra__init_bar;
        return _Nested = class Nested {
            constructor(){
                _define_property(this, "bar", (()=>{
                    const _value = _init_bar(this);
                    _init_extra__init_bar(this);
                    return _value;
                })());
            }
        }, { e: [_init_bar, _init_extra__init_bar] } = _apply_decs_2311(_Nested, [], [
            [
                [
                    _Nested,
                    _class_private_field_get(_Nested, _a)
                ],
                16,
                "bar"
            ]
        ]), _Nested;
    }
    constructor(){
        _class_private_field_init(this, _a, {
            writable: true,
            value: void 0
        });
        _initProto(this);
    }
}
({ e: [_initProto], c: [_Foo, _initClass] } = _apply_decs_2311(Foo, [
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
_initClass();
