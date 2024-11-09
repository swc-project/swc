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
(()=>{
    ({ e: [_initStatic] } = _apply_decs_2203_r(Foo, [
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
    ], []));
    _initStatic(Foo);
})();
_define_property(Foo, "value", 1);
