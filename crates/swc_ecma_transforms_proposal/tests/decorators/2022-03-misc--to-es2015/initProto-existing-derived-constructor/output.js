var _initProto;
const dec = ()=>{};
class A extends B {
    method() {}
    constructor(){
        let a = 2;
        super(a), _initProto(this);
        foo();
    }
}
({ e: [_initProto] } = _apply_decs_2203_r(A, [
    [
        deco,
        2,
        "method"
    ]
], []));
var __ = {
    writable: true,
    value: [_initProto] = _apply_decs_2203_r(A, [
        [
            deco,
            2,
            "method"
        ]
    ], []).e
};
