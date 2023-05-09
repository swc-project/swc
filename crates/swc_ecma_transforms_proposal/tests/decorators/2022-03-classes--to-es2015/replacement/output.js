var _class, __;
var _initClass;
const dec = ()=>{};
let _Foo;
new (_class = class extends _identity {
    constructor(...args){
        super(...args);
        _define_property(this, "foo", new _Foo());
        super(_Foo);
        _define_property(this, "foo", new _Foo());
        _initClass();
    }
}, __ = {
    writable: true,
    value: (()=>{
        class Foo {
        }
        var __ = {
            writable: true,
            value: (()=>{
                ({ c: [_Foo, _initClass]  } = _apply_decs_2203_r(Foo, [], [
                    dec
                ]));
            })()
        };
    })()
}, _class)();
const foo = new _Foo();
