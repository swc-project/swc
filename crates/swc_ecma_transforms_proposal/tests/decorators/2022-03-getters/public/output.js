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
                3,
                'b'
            ]
        ], []).e;
    }
    value = (_initProto(this), 1);
    get a() {
        return this.value;
    }
    get ['b']() {
        return this.value;
    }
}
