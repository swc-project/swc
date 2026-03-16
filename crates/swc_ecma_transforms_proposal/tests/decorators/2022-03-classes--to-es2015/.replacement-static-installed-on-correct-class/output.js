let _ref;
var _Foo, _x, _m, _class;
var _initClass;
const dec = ()=>{};
let hasX, hasM;
let _Foo1;
new (_x = /*#__PURE__*/ new WeakMap(), _m = /*#__PURE__*/ new WeakSet(), _ref = (_Foo = class Foo {
    static m() {}
}, { c: [_Foo1, _initClass] } = _apply_decs_2203_r(_Foo, [], [
    dec
]), _Foo), _class = class extends _identity {
    constructor(){
        super(_Foo1), _class_private_method_init(this, _m), _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        }), _define_property(this, "x", void 0), (()=>{
            hasX = (o)=>_x.has(o);
            hasM = (o)=>_m.has(o);
        })(), _initClass();
    }
}, _define_property(_class, _ref, void 0), _class)();
function m() {}
