let _initClass, _Base;
const dec = ()=>{};
const otherProto = {
    id (value) {
        return `object:${value}`;
    }
};
class Base {
    static id(value) {
        return `base:${value}`;
    }
}
_Base = Base;
let _Derived, _Derived_member;
new class extends _identity {
    constructor(){
        super(_Derived), _initClass(), _Derived_member = _Derived;
    }
    static [class Derived extends _Base {
        static{
            ({ c: [_Derived, _initClass] } = _apply_decs_2311(this, [
                dec
            ], [], 0, void 0, _Base));
        }
        static callNested(value) {
            return this.nested.getId(value);
        }
    }];
    nested = {
        __proto__: otherProto,
        getId (value) {
            return super.id(value);
        }
    };
}();
