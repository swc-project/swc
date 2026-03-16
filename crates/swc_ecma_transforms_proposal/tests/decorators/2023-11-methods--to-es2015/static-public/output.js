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
    ({ e: [_initStatic] } = _apply_decs_2311(Foo, [], [
        [
            dec,
            10,
            "a"
        ],
        [
            dec,
            10,
            _computedKey
        ]
    ]));
    _initStatic(Foo);
})();
_define_property(Foo, "value", 1);
