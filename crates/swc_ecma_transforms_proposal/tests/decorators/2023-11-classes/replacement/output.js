let _initClass;
const dec = ()=>{};
let _Foo, _Foo_member;
new class extends _identity {
    constructor(){
        super(_Foo), _initClass(), _Foo_member = _Foo;
    }
    static [class Foo {
        static{
            ({ c: [_Foo, _initClass] } = _apply_decs_2311(this, [
                dec
            ], []));
        }
    }];
    foo = new _Foo();
}();
const foo = new _Foo();
