var _class, __;
var _initClass;
const dec = ()=>{};
let _Foo;
new (_class = class extends _identity {
    constructor(){
        super(Foo), _initClass();
    }
}, __ = {
    writable: true,
    value: (()=>{
        class Foo1 {
        }
        var __ = {
            writable: true,
            value: { c: [_Foo, _initClass] } = _apply_decs_2203_r(Foo1, [], [
                dec
            ])
        };
        _define_property(Foo1, "foo", new _Foo());
    })()
}, _class)();
const foo = new Foo();
