var _computedKey, _initProto;
const dec = ()=>{};
class Foo {
    static{
        _computedKey = 'b';
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                dec,
                2,
                "a"
            ],
            [
                dec,
                2,
                _computedKey
            ]
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    value = 1;
    a() {
        return this.value;
    }
    [_computedKey]() {
        return this.value;
    }
}
