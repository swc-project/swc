var _computedKey, _computedKey1, _initProto;
const dec = ()=>{};
class Foo {
    static{
        _computedKey = getKeyI(), _computedKey1 = getKeyJ();
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
