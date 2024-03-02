var _class, __, _class1, __1;
var _initClass, _initClass1, _Foo;
const dec = ()=>{};
let _Foo1;
new (_class = class extends _identity {
    constructor(){
        super(_Foo1), _initClass();
    }
}, __ = {
    writable: true,
    value: (()=>{
        class Foo {
        }
        var __ = {
            writable: true,
            value: { c: [_Foo1, _initClass] } = _apply_decs_2203_r(Foo, [], [
                dec
            ])
        };
        _define_property(Foo, "field", 123);
    })()
}, _class)();
let _Bar;
new (_class1 = class extends _identity {
    constructor(){
        super(_Bar), _initClass1();
    }
}, __1 = {
    writable: true,
    value: (()=>{
        var _ref;
        class Bar extends (_ref = _Foo = _Foo1) {
        }
        var __ = {
            writable: true,
            value: { c: [_Bar, _initClass1] } = _apply_decs_2203_r(Bar, [], [
                dec
            ], _Foo)
        };
        _define_property(Bar, "field", ((()=>{
            Bar.otherField = 456;
        })(), 123));
    })()
}, _class1)();
