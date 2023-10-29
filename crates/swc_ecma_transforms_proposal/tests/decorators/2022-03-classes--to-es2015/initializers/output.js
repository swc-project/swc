var _define_property = require("@swc/helpers/_/_define_property");
var _apply_decs_2203_r = require("@swc/helpers/_/_apply_decs_2203_r");
var _identity = require("@swc/helpers/_/_identity");
var _class, __, _class1, __1;
var _initClass, _initClass1, _Foo;
const dec = ()=>{};
let _Foo1;
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
            value: { c: [_Foo1, _initClass] } = _apply_decs_2203_r(Foo1, [], [
                dec
            ])
        };
        _define_property(Foo1, "field", 123);
    })()
}, _class)();
let _Bar;
new (_class1 = class extends _identity {
    constructor(){
        super(Bar), _initClass1();
    }
}, __1 = {
    writable: true,
    value: (()=>{
        var _ref;
        class Bar1 extends (_ref = _Foo = Foo) {
        }
        var __ = {
            writable: true,
            value: { c: [_Bar, _initClass1] } = _apply_decs_2203_r(Bar1, [], [
                dec
            ], _Foo)
        };
        _define_property(Bar1, "field", ((()=>{
            Bar1.otherField = 456;
        })(), 123));
    })()
}, _class1)();
