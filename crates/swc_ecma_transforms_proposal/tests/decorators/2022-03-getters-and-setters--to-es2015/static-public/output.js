var _initStatic;
const dec = ()=>{};
class Foo {
    static get a() {
        return this.value;
    }
    static set a(v) {
        this.value = v;
    }
    static get ['b']() {
        return this.value;
    }
    static set ['b'](v) {
        this.value = v;
    }
}
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
                9,
                "a"
            ],
            [
                dec,
                8,
                'b'
            ],
            [
                dec,
                9,
                'b'
            ]
        ], []).e;
        _initStatic(Foo);
    })()
};
_define_property(Foo, "value", 1);
