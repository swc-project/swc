var _dec, _dec_this, _initProto;
let fn, obj;
_dec = fn(), _dec_this = obj.prop;
class A {
    method() {}
    constructor(){
        _initProto(this);
    }
}
({ e: [_initProto] } = _apply_decs_2311(A, [], [
    [
        [
            void 0,
            _dec,
            _dec_this,
            _dec_this.foo
        ],
        18,
        "method"
    ]
]));
