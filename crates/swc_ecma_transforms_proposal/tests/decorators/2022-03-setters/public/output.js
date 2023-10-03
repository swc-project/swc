var _computedKey, _initProto;
const dec = ()=>{};
class Foo {
    static{
        _computedKey = 'b';
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                dec,
                4,
                "a"
            ],
            [
                dec,
                4,
                _computedKey
            ]
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    value = 1;
    set a(v) {
        return this.value = v;
    }
    set [_computedKey](v) {
        return this.value = v;
    }
}
