var _computedKey, _computedKey1, _initStatic;
const dec = ()=>{};
_computedKey = 'b', _computedKey1 = 'b';
let _computedKey2 = _computedKey, _computedKey3 = _computedKey1;
class Foo {
    static get a() {
        return this.value;
    }
    static set a(v) {
        this.value = v;
    }
    static get [_computedKey2]() {
        return this.value;
    }
    static set [_computedKey3](v) {
        this.value = v;
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
            9,
            "a"
        ],
        [
            dec,
            8,
            _computedKey
        ],
        [
            dec,
            9,
            _computedKey1
        ]
    ], []));
    _initStatic(Foo);
})();
_define_property(Foo, "value", 1);
