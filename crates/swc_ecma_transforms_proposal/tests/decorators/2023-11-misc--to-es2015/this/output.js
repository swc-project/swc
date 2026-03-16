var _initClass, _dec_this, _init_x, _init_extra__init_x, _init_y, _init_extra__init_y, _initProto;
let _A;
_dec_this = o3.o;
class A {
    constructor(){
        _define_property(this, "x", (_initProto(this), (()=>{
            const _value = _init_x(this);
            _init_extra__init_x(this);
            return _value;
        })()));
        _define_property(this, "y", (()=>{
            const _value = _init_y(this);
            _init_extra__init_y(this);
            return _value;
        })());
    }
}
({ e: [_init_x, _init_extra__init_x, _init_y, _init_extra__init_y, _initProto], c: [_A, _initClass] } = _apply_decs_2311(A, [
    o1,
    o1.dec,
    void 0,
    dec,
    o2,
    o2.dec
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
_initClass();
