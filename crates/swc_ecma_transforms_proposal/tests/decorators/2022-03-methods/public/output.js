var _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
        [_initProto] = _apply_decs_2203_r(this, [
            [
                dec,
                2,
                "a"
            ],
            [
                dec,
                2,
                'b'
            ]
        ], []).e;
    }
    value = (_initProto(this), 1);
    a() {
        return this.value;
    }
    ['b']() {
        return this.value;
    }
}
