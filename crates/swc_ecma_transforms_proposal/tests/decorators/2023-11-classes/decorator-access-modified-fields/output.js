var _initClass, _init_m, _init_extra__init_m;
var value;
const classDec = (Class)=>{
    value = (new Class).p;
    return Class;
};
const memberDec = ()=>()=>42;
let _C;
class C {
    static{
        ({ e: [_init_m, _init_extra__init_m], c: [_C, _initClass] } = _apply_decs_2311(this, [
            classDec
        ], [
            [
                memberDec,
                0,
                "m"
            ]
        ]));
    }
    m = (()=>{
        const _value = _init_m(this);
        _init_extra__init_m(this);
        return _value;
    })();
    static{
        _initClass();
    }
}
