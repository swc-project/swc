var _computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'b';
let _computedKey1 = _computedKey;
class Foo {
    a() {
        return this.value;
    }
    [_computedKey1]() {
        return this.value;
    }
    constructor(){
        _define_property(this, "value", 1);
        _initProto(this);
    }
}
var __ = {
    writable: true,
    value: (()=>{
        [_initProto] = _applyDecs2203R(Foo, [
            [
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
            ]
        ], []).e;
    })()
};
