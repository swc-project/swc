var _initClass, _initClass1, _Foo;
const dec = ()=>{};
let _Foo1;
new class extends _identity {
    constructor(){
        super(_Foo1), _initClass();
    }
    static{
        class Foo {
            static{
                [_Foo1, _initClass] = _apply_decs_2203_r(this, [], [
                    dec
                ]).c;
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
        class Bar extends (_Foo = _Foo1) {
            static{
                [_Bar, _initClass1] = _apply_decs_2203_r(this, [], [
                    dec
                ]).c;
            }
            static field = ((()=>{
                this.otherField = 456;
            })(), 123);
        }
    }
}();
