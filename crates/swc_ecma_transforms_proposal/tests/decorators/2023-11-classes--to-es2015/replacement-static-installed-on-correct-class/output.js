var _initClass;
const dec = ()=>{};
let hasX, hasA, hasM;
let _Foo;
new class extends _identity {
    constructor(){
        super(_Foo), (()=>{
            hasX = (o)=>#x in o;
            hasA = (o)=>#a in o;
            hasM = (o)=>#m in o;
        })(), _initClass();
    }
    static{
        class Foo {
            static{
                ({ c: [_Foo, _initClass] } = _apply_decs_2311(this, [
                    dec
                ], []));
            }
            static x;
            static get a() {
                return this.#___private_a_2;
            }
            static set a(_v) {
                this.#___private_a_2 = _v;
            }
            static m() {}
        }
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
    #___private_a_2;
}();
