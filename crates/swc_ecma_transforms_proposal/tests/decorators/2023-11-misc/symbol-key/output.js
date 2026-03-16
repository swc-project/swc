let _initClass, _computedKey, _computedKey1, _computedKey2, _computedKey3, _init__computedKey, _init_extra__init__computedKey, _init__computedKey1, _init_extra__init__computedKey1;
let dec1, dec2, dec3;
_computedKey = _to_property_key(notSymbol()), _computedKey1 = _to_property_key(Symbol.iterator), _computedKey2 = _to_property_key(Symbol.for("foo")), _computedKey3 = _to_property_key(notSymbolAgain());
let _A, _A_member;
class A {
    static{
        ({ e: [_init__computedKey, _init_extra__init__computedKey, _init__computedKey1, _init_extra__init__computedKey1], c: [_A, _initClass] } = _apply_decs_2311(this, [
            dec1
        ], [
            [
                dec2,
                0,
                _computedKey1
            ],
            [
                dec3,
                0,
                _computedKey3
            ]
        ]));
    }
    constructor(){
        _init_extra__init__computedKey1(this);
    }
    [_computedKey] = 1;
    [_computedKey1] = _init__computedKey(this, 2);
    [_computedKey2] = (_init_extra__init__computedKey(this), 3);
    [_computedKey3] = _init__computedKey1(this, 4);
    static{
        _initClass();
        _A_member = _A;
    }
}
