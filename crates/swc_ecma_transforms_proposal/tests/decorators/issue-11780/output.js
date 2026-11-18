let _initClass, _Base, _fieldValue, _fieldValue1, _callSuper, _staticBlock;
const dec = ()=>{};
class Base {
    static styles = [
        "base"
    ];
    static color = "blue";
    static id(value) {
        return `base:${value}`;
    }
    static method() {
        return "base-method";
    }
    static #___private_value_1 = "base-accessor";
    static get value() {
        return Base.#___private_value_1;
    }
    static set value(_v) {
        Base.#___private_value_1 = _v;
    }
}
_Base = Base;
let _Derived, _Derived_member;
new class extends _identity {
    constructor(){
        super(_Derived), _staticBlock.call(this), _initClass(), _Derived_member = _Derived;
    }
    static [class Derived extends _Base {
        static{
            ({ c: [_Derived, _initClass] } = _apply_decs_2311(this, [
                dec
            ], [], 0, void 0, _Base));
        }
        static get value() {
            return Derived.#___private_value_1;
        }
        static set value(_v) {
            Derived.#___private_value_1 = _v;
        }
        static callSuper() {
            return _Derived.#callSuper();
        }
        static{
            _fieldValue = function() {
                return [
                    ..._get(_get_prototype_of(_Derived), "styles", this),
                    "derived"
                ];
            };
            _fieldValue1 = function() {
                return _get(_get_prototype_of(_Derived), "value", this);
            };
            _callSuper = function() {
                return _get(_get_prototype_of(_Derived), "method", this).call(this);
            };
            _staticBlock = function() {
                this.blockValue = _get(_get_prototype_of(_Derived), "id", this).call(this, _get(_get_prototype_of(_Derived), "color", this));
            };
        }
    }];
    styles = _fieldValue.call(this);
    #___private_value_1 = _fieldValue1.call(this);
    #callSuper() {
        return _callSuper.apply(this, arguments);
    }
}();
