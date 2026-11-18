let _ref, _ref1;
var _Foo, _class, _Bar, _class1;
var _initClass, _initClass1, _Foo1;
const dec = ()=>{};
let _Foo2;
new (_ref = (_Foo = class Foo {
}, { c: [_Foo2, _initClass] } = _apply_decs_2203_r(_Foo, [], [
    dec
]), _Foo), _class = class extends _identity {
    constructor(){
        super(_Foo2), _define_property(this, "field", 123), _initClass();
    }
}, _define_property(_class, _ref, void 0), _class)();
let _Bar1;
new (_ref1 = (_Bar = class Bar extends (_Foo1 = _Foo2) {
}, { c: [_Bar1, _initClass1] } = _apply_decs_2203_r(_Bar, [], [
    dec
], _Foo1), _Bar), _class1 = class extends _identity {
    constructor(){
        super(_Bar1), _define_property(this, "field", ((()=>{
            this.otherField = 456;
        })(), 123)), _initClass1();
    }
}, _define_property(_class1, _ref1, void 0), _class1)();
