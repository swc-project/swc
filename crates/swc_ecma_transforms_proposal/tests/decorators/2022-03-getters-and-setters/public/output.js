var _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
        [_initProto] = _apply_decs_2203_r(this, [
            [
                dec,
                3,
                "a"
            ],
            [
                dec,
                4,
                "a"
            ],
            [
                dec,
                3,
                'b'
            ],
            [
                dec,
                4,
                'b'
            ]
        ], []).e;
    }
    value = (_initProto(this), 1);
    get a() {
        return this.value;
    }
    set a(v) {
        this.value = v;
    }
    get ['b']() {
        return this.value;
    }
    set ['b'](v) {
        this.value = v;
    }
}
