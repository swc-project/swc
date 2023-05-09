var _initClass;
const dec = ()=>{};
let _Foo;
new class extends _identity {
    constructor(...args){
        super(...args);
        super(_Foo);
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
    foo = new _Foo();
}();
const foo = new _Foo();
