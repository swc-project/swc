var _initProto;
const dec = ()=>{};
class Foo {
    a() {
        return this.value;
    }
    ['b']() {
        return this.value;
    }
    constructor(){
        _define_property(this, "value", 1);
        _initProto(this);
    }
}
var __ = {
    writable: true,
    value: [_initProto] = _apply_decs_2203_r(Foo, [
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
    ], []).e
};
