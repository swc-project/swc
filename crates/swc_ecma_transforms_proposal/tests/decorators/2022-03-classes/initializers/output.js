var _initClass, _initClass1;
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
    field = 123;
    constructor(){
        super(_Foo), _initClass();
    }
}();
let _Bar;
new class extends _identity {
    static{
        class Bar extends _Foo {
            static{
                ({ c: [_Bar, _initClass1]  } = _apply_decs_2203_r(this, [], [
                    dec
                ]));
            }
        }
    }
    field = ((()=>{
        this.otherField = 456;
    })(), 123);
    constructor(){
        super(_Bar), _initClass1();
    }
}();
