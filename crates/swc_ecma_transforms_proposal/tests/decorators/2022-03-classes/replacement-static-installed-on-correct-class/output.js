var _initClass;
const dec = ()=>{};
let hasX, hasM;
let _Foo;
new class extends _identity {
    constructor(){
        super(_Foo), (()=>{
            hasX = (o)=>#x in o;
            hasM = (o)=>#m in o;
        })(), _initClass();
    }
    static{
        class Foo {
            static{
                ({ c: [_Foo, _initClass]  } = _apply_decs_2203_r(this, [], [
                    dec
                ]));
            }
            static x;
            static m() {}
        }
    }
    #x;
    #m() {}
}();
