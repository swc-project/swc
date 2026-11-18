let _init_a, _init_extra__init_a, _get___a, _set___a, _init_b, _init_extra__init_b, _get___b, _set___b;
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
({ e: [_init_a, _get___a, _set___a, _init_extra__init_a, _init_b, _get___b, _set___b, _init_extra__init_b] } = _apply_decs_2311(Foo, [], [
    [
        dec,
        9,
        "a",
        function(_this) {
            return _class_static_private_field_spec_get(_this, Foo, ___a_1);
        },
        function(_this, _v) {
            _class_static_private_field_spec_set(_this, Foo, ___a_1, _v);
        }
    ],
    [
        dec,
        9,
        "b",
        function(_this) {
            return _class_static_private_field_spec_get(_this, Foo, ___b_2);
        },
        function(_this, _v) {
            _class_static_private_field_spec_set(_this, Foo, ___b_2, _v);
        }
    ]
]));
var ___a_1 = {
    writable: true,
    value: (()=>{
        const _value = _init_a();
        _init_extra__init_a();
        return _value;
    })()
};
var ___b_2 = {
    writable: true,
    value: (()=>{
        const _value = _init_b(123);
        _init_extra__init_b();
        return _value;
    })()
};
function get_a() {
    return _get___a();
}
function set_a(_v) {
    _set___a(_v);
}
function get_b() {
    return _get___b();
}
function set_b(_v) {
    _set___b(_v);
}
