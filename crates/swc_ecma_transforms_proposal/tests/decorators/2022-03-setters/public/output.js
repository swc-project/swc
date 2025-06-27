var _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
        [_initProto] = _apply_decs_2203_r(this, [
            [
                dec,
                4,
                "a"
            ],
            [
                dec,
                4,
                'b'
            ]
        ], []).e;
    }
    value = (_initProto(this), 1);
    set a(v) {
        return this.value = v;
    }
    set ['b'](v) {
        return this.value = v;
    }
}
