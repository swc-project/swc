var _computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'b';
let _computedKey1 = _computedKey;
class Foo {
    set a(v) {
        return this.value = v;
    }
    set [_computedKey1](v) {
        return this.value = v;
    }
    constructor(){
        _define_property(this, "value", 1);
        _initProto(this);
    }
}
var __ = {
    writable: true,
    value: (()=>{
        ({ e: [_initProto]  } = _apply_decs_2203_r(Foo, [
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
    })()
};
