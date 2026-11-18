let _ref;
var _Foo, _class;
let _initClass;
const dec = ()=>{};
let _Foo1, _Foo_member;
new (_ref = (_Foo = class Foo {
}, { c: [_Foo1, _initClass] } = _apply_decs_2311(_Foo, [
    dec
], []), _Foo), _class = class extends _identity {
    constructor(){
        super(_Foo1), _define_property(this, "foo", new _Foo1()), _initClass(), _Foo_member = _Foo1;
    }
}, _define_property(_class, _ref, void 0), _class)();
const foo = new _Foo1();
