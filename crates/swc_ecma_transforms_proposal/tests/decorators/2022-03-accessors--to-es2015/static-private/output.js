var _init_a, _get___a, _set___a, _init_b, _get___b, _set___b, _initStatic;
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
(()=>{
    ({ e: [_init_a, _get___a, _set___a, _init_b, _get___b, _set___b, _initStatic] } = _apply_decs_2203_r(Foo, [
        [
            dec,
            6,
            "a",
            function() {
                return _class_static_private_field_spec_get(this, Foo, ___a_1);
            },
            function(_v) {
                _class_static_private_field_spec_set(this, Foo, ___a_1, _v);
            }
        ],
        [
            dec,
            6,
            "b",
            function() {
                return _class_static_private_field_spec_get(this, Foo, ___b_2);
            },
            function(_v) {
                _class_static_private_field_spec_set(this, Foo, ___b_2, _v);
            }
        ]
    ], []));
    _initStatic(Foo);
})();
var ___a_1 = {
    writable: true,
    value: _init_a(Foo)
};
var ___b_2 = {
    writable: true,
    value: _init_b(Foo, 123)
};
function get_a() {
    return _get___a(this);
}
function set_a(_v) {
    _set___a(this, _v);
}
function get_b() {
    return _get___b(this);
}
function set_b(_v) {
    _set___b(this, _v);
}
