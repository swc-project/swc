let _initClass, _initProto;
var value;
const classDec = (Class)=>{
    value = (new Class).m();
    return Class;
};
const memberDec = ()=>()=>42;
let _C, _C_member;
class C {
    static{
        ({ e: [_initProto], c: [_C, _initClass] } = _apply_decs_2311(this, [
            classDec
        ], [
            [
                memberDec,
                2,
                "m"
            ]
        ]));
    }
    constructor(){
        _initProto(this);
    }
    m() {}
    static{
        _initClass();
        _C_member = _C;
    }
}
