let _initClass, _init_m, _init_extra__init_m;
var value;
const classDec = (Class)=>{
    value = (new Class).p;
    return Class;
};
const memberDec = ()=>()=>42;
let _C, _C_member;
class C {
    constructor(){
        _define_property(this, "m", _init_m(this));
        _init_extra__init_m(this);
    }
}
({ e: [_init_m, _init_extra__init_m], c: [_C, _initClass] } = _apply_decs_2311(C, [
    classDec
], [
    [
        memberDec,
        0,
        "m"
    ]
]));
(()=>{
    _initClass();
    _C_member = _C;
})();
