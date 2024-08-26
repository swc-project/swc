var _initStatic;
const dec = ()=>{};
class Foo {
    static set a(v) {
        return this.value = v;
    }
    static set ['b'](v) {
        return this.value = v;
    }
}
var __ = {
    writable: true,
    value: (()=>{
        [_initStatic] = _apply_decs_2203_r(Foo, [
            [
                dec,
                9,
                "a"
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
