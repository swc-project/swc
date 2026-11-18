let _ref;
var _x, ___a_1, _a, _m, ____private_a_2, _Foo, _method, _class;
let _initClass, _Base, _method1;
const dec = ()=>{};
let hasX, hasA, hasM;
class Base {
    static id(v) {
        return v;
    }
}
_Base = Base;
let _Foo1, _Foo_member;
new (_method = /*#__PURE__*/ new WeakSet(), _ref = (_x = /*#__PURE__*/ new WeakMap(), ___a_1 = /*#__PURE__*/ new WeakMap(), _a = /*#__PURE__*/ new WeakMap(), _m = /*#__PURE__*/ new WeakSet(), ____private_a_2 = /*#__PURE__*/ new WeakMap(), _Foo = class Foo extends _Base {
    get a() {
        return _class_private_field_get(this, ____private_a_2);
    }
    set a(_v) {
        _class_private_field_set(this, ____private_a_2, _v);
    }
    m() {}
    constructor(...args){
        super(...args), _class_private_field_init(this, _a, {
            get: get_a,
            set: set_a
        }), _class_private_method_init(this, _m), _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        }), _class_private_field_init(this, ___a_1, {
            writable: true,
            value: void 0
        }), _define_property(this, "x", void 0), _class_private_field_init(this, ____private_a_2, {
            writable: true,
            value: void 0
        });
    }
}, { c: [_Foo1, _initClass] } = _apply_decs_2311(_Foo, [
    dec
], [], 0, void 0, _Base), _method1 = function() {
    _get(_get_prototype_of(_Foo1), "id", this).call(this, this);
    hasX = (o)=>_x.has(o);
    hasA = (o)=>_a.has(o);
    hasM = (o)=>_m.has(o);
}, _Foo), _class = class extends _identity {
    constructor(){
        super(_Foo1), _class_private_method_init(this, _method), _initClass(), _Foo_member = _Foo1;
    }
}, _define_property(_class, _ref, void 0), _class)();
function get_a() {
    return _class_private_field_get(this, ___a_1);
}
function set_a(_v) {
    _class_private_field_set(this, ___a_1, _v);
}
function m() {}
function method() {
    return _method1.apply(this, arguments);
}
