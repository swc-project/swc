let _initClass, _Base, _method;
const dec = ()=>{};
let hasX, hasA, hasM;
class Base {
    static id(v) {
        return v;
    }
}
_Base = Base;
let _Foo, _Foo_member;
new class extends _identity {
    constructor(){
        super(_Foo), _initClass(), _Foo_member = _Foo;
    }
    static [class Foo extends _Base {
        static{
            ({ c: [_Foo, _initClass] } = _apply_decs_2311(this, [
                dec
            ], [], 0, void 0, _Base));
        }
        #x;
        #__a_1;
        get #a() {
            return this.#__a_1;
        }
        set #a(_v) {
            this.#__a_1 = _v;
        }
        #m() {}
        x;
        #___private_a_2;
        get a() {
            return this.#___private_a_2;
        }
        set a(_v) {
            this.#___private_a_2 = _v;
        }
        m() {}
        static{
            _method = function() {
                _get(_get_prototype_of(_Foo), "id", this).call(this, this);
                hasX = (o)=>#x in o;
                hasA = (o)=>#a in o;
                hasM = (o)=>#m in o;
            };
        }
    }];
    #method() {
        return _method.apply(this, arguments);
    }
}();
