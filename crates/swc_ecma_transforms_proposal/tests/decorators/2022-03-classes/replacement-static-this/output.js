var _initClass;
const dec = ()=>{};
let _Foo;
new class extends _identity {
    constructor(...args){
        super(...args);
        super(_Foo);
        (()=>{
            this;
        })();
        _initClass();
    }
    static{
        class Foo {
            static{
                ({ c: [_Foo, _initClass]  } = _apply_decs_2203_r(this, [], [
                    dec
                ]));
            }
        }
    }
    field = ((()=>{
        this;
    })(), this);
}();
