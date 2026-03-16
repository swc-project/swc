let _initClass, _initClass1, _Foo;
const dec = ()=>{};
let _Foo1, _Foo_member;
new class extends _identity {
    constructor(){
        super(_Foo1), _initClass(), _Foo_member = _Foo1;
    }
    static [class Foo {
        static{
            ({ c: [_Foo1, _initClass] } = _apply_decs_2311(this, [
                dec
            ], []));
        }
    }];
    field = 123;
}();
_Foo = _Foo1;
let _Bar, _Bar_member;
new class extends _identity {
    constructor(){
        super(_Bar), _initClass1(), _Bar_member = _Bar;
    }
    static [class Bar extends _Foo {
        static{
            ({ c: [_Bar, _initClass1] } = _apply_decs_2311(this, [
                dec
            ], [], 0, void 0, _Foo));
        }
    }];
    field = ((()=>{
        this.otherField = 456;
    })(), 123);
}();
