var _class;
var _initClass;
const dec = ()=>{};
let hasX, hasA, hasM;
let _Foo;
new (_class = class extends _identity {
    constructor(){
        super(_Foo), (()=>{
            hasX = (o)=>#x in o;
            hasA = (o)=>#a in o;
            hasM = (o)=>#m in o;
        })(), _initClass();
    }
}, (()=>{
    var _x = /*#__PURE__*/ new WeakMap(), ___a_1 = /*#__PURE__*/ new WeakMap(), _a = /*#__PURE__*/ new WeakMap(), _m = /*#__PURE__*/ new WeakSet(), ____private_a_2 = /*#__PURE__*/ new WeakMap();
    class Foo {
        get a() {
            return _class_private_field_get(this, ____private_a_2);
        }
        set a(_v) {
            _class_private_field_set(this, ____private_a_2, _v);
        }
        m() {}
        constructor(){
            _class_private_field_init(this, _a, {
                get: get_a,
                set: set_a
            });
            _class_private_method_init(this, _m);
            _class_private_field_init(this, _x, {
                writable: true,
                value: void 0
            });
            _class_private_field_init(this, ___a_1, {
                writable: true,
                value: void 0
            });
            _define_property(this, "x", void 0);
            _class_private_field_init(this, ____private_a_2, {
                writable: true,
                value: void 0
            });
        }
    }
    ({ c: [_Foo, _initClass] } = _apply_decs_2311(Foo, [
        dec
    ], []));
    function get_a() {
        return _class_private_field_get(this, ___a_1);
    }
    function set_a(_v) {
        _class_private_field_set(this, ___a_1, _v);
    }
    function m() {}
})(), _class)();
