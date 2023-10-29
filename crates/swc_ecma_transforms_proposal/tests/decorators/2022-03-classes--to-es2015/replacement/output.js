var _class, __;
var _initClass;
const dec = ()=>{};
let _Foo;
new (_class = class extends _identity {
    constructor(){
        super(_Foo), _initClass();
    }
}, __ = {
    writable: true,
    value: (()=>{
        class Foo {
        }
        var __ = {
            writable: true,
            value: { c: [_Foo, _initClass] } = _apply_decs_2203_r(Foo, [], [
                dec
            ])
        };
        _define_property(Foo, "foo", new _Foo());
    })()
}, _class)();
const foo = new _Foo();
