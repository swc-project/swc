var _initClass;
const dec = ()=>{};
let _Foo;
new class extends _identity {
    static{
        class Foo {
            static{
                ({ c: [_Foo, _initClass]  } = _apply_decs_2203_r(this, [], [
                    dec
                ]));
            }
        }
    }
    foo = new _Foo();
    constructor(){
        super(_Foo), _initClass();
    }
}();
const foo = new _Foo();
