const dec = ()=>{};
var ___a = /*#__PURE__*/ new WeakMap(), _a = /*#__PURE__*/ new WeakMap(), ___b = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _class_private_field_init(this, _a, {
            get: get_a,
            set: set_a
        });
        _class_private_field_init(this, _b, {
            get: get_b,
            set: set_b
        });
        _class_private_field_init(this, ___a, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, ___b, {
            writable: true,
            value: 123
        });
    }
}
function get_a() {
    return _class_private_field_get(this, ___a);
}
function set_a(_v) {
    _class_private_field_set(this, ___a, _v);
}
function get_b() {
    return _class_private_field_get(this, ___b);
}
function set_b(_v) {
    _class_private_field_set(this, ___b, _v);
}
