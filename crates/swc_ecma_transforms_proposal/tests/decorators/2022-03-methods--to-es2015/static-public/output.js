var _initStatic;
const dec = ()=>{};
class Foo {
    static a() {
        return this.value;
    }
    static ['b']() {
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
var __ = {
    writable: true,
    value: (()=>{
        [_initStatic] = _apply_decs_2203_r(Foo, [
            [
                dec,
                7,
                "a"
            ],
            [
                dec,
                7,
                'b'
            ]
        ], []).e;
        _initStatic(Foo);
    })()
};
_define_property(Foo, "value", 1);
