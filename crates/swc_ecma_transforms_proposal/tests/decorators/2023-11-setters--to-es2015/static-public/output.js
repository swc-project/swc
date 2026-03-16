let _computedKey, _initStatic;
const dec = ()=>{};
_computedKey = _to_property_key('b');
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
    ({ e: [_initStatic] } = _apply_decs_2311(Foo, [], [
        [
            dec,
            12,
            "a"
        ],
        [
            dec,
            12,
            _computedKey
        ]
    ]));
    _initStatic(Foo);
})();
_define_property(Foo, "value", 1);
