let _initClass;
function classDec(target, context) {}
let _C, _C_member;
new class extends _identity {
    constructor(){
        super(_C), _initClass(), _C_member = _C;
    }
    static [class C {
        static{
            ({ c: [_C, _initClass] } = _apply_decs_2311(this, [
                classDec
            ], []));
        }
    }];
    foo = false;
}();
