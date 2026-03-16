var _initClass;
function classDec(target, context) {}
let _C;
new class extends _identity {
    constructor(){
        super(_C), _initClass();
    }
    static{
        class C {
            static{
                ({ c: [_C, _initClass] } = _apply_decs_2311(this, [
                    classDec
                ], []));
            }
            static foo = false;
        }
    }
}();
