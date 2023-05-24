var _initClass, _initClass1;
const dec = ()=>{};
let _Foo;
new class extends _identity {
    constructor(){
        super(_Foo), _initClass();
    }
    static{
        class Foo {
            static{
                ({ c: [_Foo, _initClass]  } = _apply_decs_2203_r(this, [], [
                    dec
                ]));
            }
            static field = 123;
        }
    }
}();
let _Bar;
new class extends _identity {
    constructor(){
        super(_Bar), _initClass1();
    }
    static{
        class Bar extends _Foo {
            static{
                ({ c: [_Bar, _initClass1]  } = _apply_decs_2203_r(this, [], [
                    dec
                ]));
            }
            static field = ((()=>{
                this.otherField = 456;
            })(), 123);
        }
    }
}();
