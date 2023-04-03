var _computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'b';
class Foo {
    static{
        ({ e: [_initProto]  } = _apply_decs_2203_r(this, [
            [
                dec,
                3,
                "a"
            ],
            [
                dec,
                3,
                _computedKey
            ]
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    value = 1;
    get a() {
        return this.value;
    }
    get [_computedKey]() {
        return this.value;
    }
}
