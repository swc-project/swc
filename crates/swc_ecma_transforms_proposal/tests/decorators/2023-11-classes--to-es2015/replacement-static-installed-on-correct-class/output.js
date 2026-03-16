var _x, ___a_1, _a, _m, ____private_a_2, _class;
var _initClass;
const dec = ()=>{};
let hasX, hasA, hasM;
let _Foo;
new (_x = /*#__PURE__*/ new WeakMap(), ___a_1 = /*#__PURE__*/ new WeakMap(), _a = /*#__PURE__*/ new WeakMap(), _m = /*#__PURE__*/ new WeakSet(), ____private_a_2 = /*#__PURE__*/ new WeakMap(), _class = class extends _identity {
    constructor(){
        super(_Foo), _class_private_field_init(this, _a, {
            get: get_a,
            set: set_a
        }), _class_private_method_init(this, _m), _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        }), _class_private_field_init(this, ___a_1, {
            writable: true,
            value: void 0
        }), _class_private_field_init(this, ____private_a_2, {
            writable: true,
            value: void 0
        }), (()=>{
            hasX = (o)=>_x.has(o);
            hasA = (o)=>_a.has(o);
            hasM = (o)=>_m.has(o);
        })(), _initClass();
    }
}, (()=>{
    class Foo {
        static get a() {
            return _class_private_field_get(this, ____private_a_2);
        }
        static set a(_v) {
            _class_private_field_set(this, ____private_a_2, _v);
        }
        static m() {}
    }
    ({ c: [_Foo, _initClass] } = _apply_decs_2311(Foo, [
        dec
    ], []));
    _define_property(Foo, "x", void 0);
})(), _class)();
function get_a() {
    return _class_private_field_get(this, ___a_1);
}
function set_a(_v) {
    _class_private_field_set(this, ___a_1, _v);
}
function m() {}
