let _dec, _dec1, _initClass, _dec_this, _init_x, _init_extra__init_x, _init_y, _init_extra__init_y;
_dec = o1.dec, _dec1 = o2.dec, _dec_this = o3.o;
let _A, _A_member;
class A {
    constructor(){
        _define_property(this, "x", _init_x(this));
        _define_property(this, "y", (_init_extra__init_x(this), _init_y(this)));
        _init_extra__init_y(this);
    }
}
({ e: [_init_x, _init_extra__init_x, _init_y, _init_extra__init_y], c: [_A, _initClass] } = _apply_decs_2311(A, [
    o1,
    _dec,
    void 0,
    dec,
    o2,
    _dec1
], [
    [
        [
            o2,
            o2.dec,
            _dec_this,
            _dec_this.dec
        ],
        16,
        "x"
    ],
    [
        [
            o2,
            o2.dec,
            void 0,
            dec
        ],
        16,
        "y"
    ]
], 1));
(()=>{
    _initClass();
    _A_member = _A;
})();
