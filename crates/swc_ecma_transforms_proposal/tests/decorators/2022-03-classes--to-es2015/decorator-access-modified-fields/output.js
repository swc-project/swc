var _initClass, _init_m;
var value;
const classDec = (Class)=>{
    value = (new Class).p;
    return Class;
};
const memberDec = ()=>()=>42;
let _C;
class C {
    constructor(){
        _define_property(this, "m", _init_m(this));
    }
}
({ e: [_init_m], c: [_C, _initClass] } = _apply_decs_2203_r(C, [
    [
        memberDec,
        0,
        "m"
    ]
], [
    classDec
]));
_initClass();
