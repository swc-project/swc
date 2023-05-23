var _x, _m, _class, __;
var _initClass;
const dec = ()=>{};
let hasX, hasM;
let _Foo;
new (_x = /*#__PURE__*/ new WeakMap(), _m = /*#__PURE__*/ new WeakSet(), _class = class extends _identity {
    constructor(){
        var _temp;
        _temp = super(_Foo), _class_private_method_init(this, _m), _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        }), _define_property(this, "x", void 0), _temp, (()=>{
            hasX = (o)=>_x.has(o);
            hasM = (o)=>_m.has(o);
        })(), _initClass();
    }
}, __ = {
    writable: true,
    value: (()=>{
        class Foo {
            static m() {}
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
function m() {}
