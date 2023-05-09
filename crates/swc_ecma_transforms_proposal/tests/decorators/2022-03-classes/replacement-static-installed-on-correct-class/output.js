var _initClass;
const dec = ()=>{};
let hasX, hasM;
let _Foo;
new class extends _identity {
    static{
        class Foo {
            static{
                ({ c: [_Foo, _initClass]  } = _apply_decs_2203_r(this, [], [
                    dec
                ]));
            }
            static m() {}
        }
    }
    #x;
    #m() {}
    x;
    constructor(){
        super(_Foo), (()=>{
            hasX = (o)=>#x in o;
            hasM = (o)=>#m in o;
        })(), _initClass();
    }
}();
