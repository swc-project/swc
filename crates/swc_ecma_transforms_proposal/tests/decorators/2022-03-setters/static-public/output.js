var _initStatic;
const dec = ()=>{};
class Foo {
    static{
        [_initStatic] = _apply_decs_2203_r(this, [
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
        _initStatic(this);
    }
    static value = 1;
    static set a(v) {
        return this.value = v;
    }
    static set ['b'](v) {
        return this.value = v;
    }
}
