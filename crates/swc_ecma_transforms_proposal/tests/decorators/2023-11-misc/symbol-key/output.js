var _initClass, _computedKey, _computedKey1, _computedKey2, _computedKey3, _init__computedKey, _init__computedKey1, _initProto;
let dec1, dec2, dec3;
let _A;
_computedKey = notSymbol(), _computedKey1 = Symbol.iterator, _computedKey2 = Symbol.for("foo"), _computedKey3 = notSymbolAgain();
class A {
    static{
        ({ e: [_init__computedKey, _init__computedKey1, _initProto], c: [_A, _initClass] } = _apply_decs_2311(this, [
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
    [_computedKey] = (_initProto(this), 1);
    [_computedKey1] = _init__computedKey(this, 2);
    [_computedKey2] = 3;
    [_computedKey3] = _init__computedKey1(this, 4);
    static{
        _initClass();
    }
}
