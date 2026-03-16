let _computedKey, _initStatic;
const dec = ()=>{};
_computedKey = _to_property_key('b');
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
    ({ e: [_initStatic] } = _apply_decs_2311(Foo, [], [
        [
            dec,
            11,
            "a"
        ],
        [
            dec,
            11,
            _computedKey
        ]
    ]));
    _initStatic(Foo);
})();
_define_property(Foo, "value", 1);
