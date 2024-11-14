var _computedKey, _initStatic;
const dec = ()=>{};
_computedKey = 'b';
let _computedKey1 = _computedKey;
class Foo {
    static get a() {
        return this.value;
    }
    static get [_computedKey1]() {
        return this.value;
    }
}
(()=>{
    ({ e: [_initStatic] } = _apply_decs_2203_r(Foo, [
        [
            dec,
            8,
            "a"
        ],
        [
            dec,
            8,
            _computedKey
        ]
    ], []));
    _initStatic(Foo);
})();
_define_property(Foo, "value", 1);
