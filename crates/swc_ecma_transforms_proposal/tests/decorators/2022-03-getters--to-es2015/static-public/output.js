var _initStatic;
const dec = ()=>{};
class Foo {
    static get a() {
        return this.value;
    }
    static get ['b']() {
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
var __ = {
    writable: true,
    value: (()=>{
        [_initStatic] = _apply_decs_2203_r(Foo, [
            [
                dec,
                8,
                "a"
            ],
            [
                dec,
                8,
                'b'
            ]
        ], []).e;
        _initStatic(Foo);
    })()
};
_define_property(Foo, "value", 1);
