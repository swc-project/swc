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
var __ = {
    writable: true,
    value: (()=>{
        ({ e: [_initProto] , c: [_C, _initClass]  } = _apply_decs_2203_r(C, [
            [
                memberDec,
                2,
                "m"
            ]
        ], [
            classDec
        ]));
    })()
};
var __1 = {
    writable: true,
    value: (()=>{
        _initClass();
    })()
};
