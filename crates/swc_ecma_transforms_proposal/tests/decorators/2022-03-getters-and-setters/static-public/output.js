var _initStatic;
const dec = ()=>{};
class Foo {
    static{
        [_initStatic] = _apply_decs_2203_r(this, [
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
        _initStatic(this);
    }
    static value = 1;
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
