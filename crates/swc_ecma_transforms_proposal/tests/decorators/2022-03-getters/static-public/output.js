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
                8,
                'b'
            ]
        ], []).e;
        _initStatic(this);
    }
    static value = 1;
    static get a() {
        return this.value;
    }
    static get ['b']() {
        return this.value;
    }
}
