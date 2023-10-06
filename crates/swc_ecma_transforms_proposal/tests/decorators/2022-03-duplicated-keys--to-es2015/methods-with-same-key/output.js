var _initProto;
const dec = ()=>{};
class Foo {
    a() {
        return 1;
    }
    a() {
        return 2;
    }
    constructor(){
        _initProto(this);
    }
}
var __ = {
    writable: true,
    value: { e: [_initProto] } = _apply_decs_2203_r(Foo, [
        [
            dec,
            2,
            "a"
        ],
        [
            dec,
            2,
            "a"
        ]
    ], [])
};
