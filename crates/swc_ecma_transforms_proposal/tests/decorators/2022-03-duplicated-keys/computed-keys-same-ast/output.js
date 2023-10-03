var _computedKey, _computedKey1, _initProto;
const dec = ()=>{};
class Foo {
    static{
        _computedKey = getKey(), _computedKey1 = getKey();
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                dec,
                2,
                _computedKey
            ],
            [
                dec,
                2,
                _computedKey1
            ]
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    [_computedKey]() {
        return 1;
    }
    [_computedKey1]() {
        return 2;
    }
}
