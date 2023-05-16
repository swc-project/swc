const dec = ()=>{};
class Foo {
}
var _a = {
    get: get_a,
    set: set_a
};
var _b = {
    get: get_b,
    set: set_b
};
var ___a = {
    writable: true,
    value: void 0
};
var ___b = {
    writable: true,
    value: 123
};
function get_a() {
    return _class_static_private_field_spec_get(this, Foo, ___a);
}
function set_a(_v) {
    _class_static_private_field_spec_set(this, Foo, ___a, _v);
}
function get_b() {
    return _class_static_private_field_spec_get(this, Foo, ___b);
}
function set_b(_v) {
    _class_static_private_field_spec_set(this, Foo, ___b, _v);
}
