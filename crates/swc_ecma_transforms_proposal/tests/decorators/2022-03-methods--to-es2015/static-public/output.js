var _computedKey, _initStatic;
const dec = ()=>{};
_computedKey = 'b';
let _computedKey1 = _computedKey;
class Foo {
    static a() {
        return this.value;
    }
    static [_computedKey1]() {
        return this.value;
    }
}
var __ = {
    writable: true,
    value: (()=>{
        [_initStatic] = _applyDecs2203R(Foo, [
            [
                dec,
                7,
                "a"
            ],
            [
                dec,
                7,
                _computedKey
            ]
        ], []).e;
        _initStatic(Foo);
    })()
};
_define_property(Foo, "value", 1);
