var _call_a, _call_a1, _initProto;
const dec = ()=>{};
var _a = /*#__PURE__*/ new WeakMap();
class Foo {
    getA() {
        return _class_private_field_get(this, _a);
    }
    setA(v) {
        _class_private_field_set(this, _a, v);
    }
    constructor(){
        _class_private_field_init(this, _a, {
            get: get_a,
            set: set_a
        });
        _define_property(this, "value", 1);
        _initProto(this);
    }
}
var __ = {
    writable: true,
    value: (()=>{
        ({ e: [_call_a, _call_a1, _initProto]  } = _apply_decs_2203_r(Foo, [
            [
                dec,
                3,
                "a",
                function() {
                    return this.value;
                }
            ],
            [
                dec,
                4,
                "a",
                function(v) {
                    this.value = v;
                }
            ]
        ], []));
    })()
};
function get_a() {
    return _call_a(this);
}
function set_a(v) {
    _call_a1(this, v);
}
