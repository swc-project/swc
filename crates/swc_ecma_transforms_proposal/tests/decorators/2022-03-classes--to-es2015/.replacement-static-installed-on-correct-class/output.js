var _x, _m, _class;
var _initClass;
const dec = ()=>{};
let hasX, hasM;
let _Foo;
new (_x = /*#__PURE__*/ new WeakMap(), _m = /*#__PURE__*/ new WeakSet(), _class = class extends _identity {
    constructor(){
        super(_Foo), _class_private_method_init(this, _m), _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        }), (()=>{
            hasX = (o)=>_x.has(o);
            hasM = (o)=>_m.has(o);
        })(), _initClass();
    }
}, (()=>{
    class Foo {
        static m() {}
    }
    ({ c: [_Foo, _initClass] } = _apply_decs_2203_r(Foo, [], [
        dec
    ]));
    _define_property(Foo, "x", void 0);
})(), _class)();
function m() {}
