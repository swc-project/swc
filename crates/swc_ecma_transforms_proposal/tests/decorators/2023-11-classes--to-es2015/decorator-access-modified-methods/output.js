var _initClass, _initProto;
var value;
const classDec = (Class)=>{
    value = (new Class).m();
    return Class;
};
const memberDec = ()=>()=>42;
let _C;
class C {
    m() {}
    constructor(){
        _initProto(this);
    }
}
({ e: [_initProto], c: [_C, _initClass] } = _apply_decs_2311(C, [
    classDec
], [
    [
        memberDec,
        2,
        "m"
    ]
]));
_initClass();
