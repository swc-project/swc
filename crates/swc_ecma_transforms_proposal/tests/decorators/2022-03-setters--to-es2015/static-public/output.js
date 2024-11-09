var _computedKey, _initStatic;
const dec = ()=>{};
_computedKey = 'b';
let _computedKey1 = _computedKey;
class Foo {
    static set a(v) {
        return this.value = v;
    }
    static set [_computedKey1](v) {
        return this.value = v;
    }
}
(()=>{
    ({ e: [_initStatic] } = _apply_decs_2203_r(Foo, [
        [
            dec,
            9,
            "a"
        ],
        [
            dec,
            9,
            _computedKey
        ]
    ], []));
    _initStatic(Foo);
})();
_define_property(Foo, "value", 1);
