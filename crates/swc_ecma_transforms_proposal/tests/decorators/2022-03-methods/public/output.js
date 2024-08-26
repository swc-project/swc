var _initProto;
const dec = ()=>{};
class Foo {
    static{
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
    constructor(){
        _initProto(this);
    }
    value = 1;
    a() {
        return this.value;
    }
    ['b']() {
        return this.value;
    }
}
