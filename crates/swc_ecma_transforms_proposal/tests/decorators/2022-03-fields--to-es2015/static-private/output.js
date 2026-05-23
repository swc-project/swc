var _init_a, _init_extra_a, _init_b, _init_extra_b;
const dec = ()=>{};
class Foo {
}
({ e: [_init_a, _init_extra_a, _init_b, _init_extra_b] } = _apply_decs_2203_r(Foo, [
    [
        dec,
        5,
        "a",
        function() {
            return _class_static_private_field_spec_get(this, Foo, _a);
        },
        function(value) {
            _class_static_private_field_spec_set(this, Foo, _a, value);
        }
    ],
    [
        dec,
        5,
        "b",
        function() {
            return _class_static_private_field_spec_get(this, Foo, _b);
        },
        function(value) {
            _class_static_private_field_spec_set(this, Foo, _b, value);
        }
    ]
], []));
var _a = {
    writable: true,
    value: (()=>{
        const _value = _init_a(Foo);
        _init_extra_a(Foo);
        return _value;
    })()
};
var _b = {
    writable: true,
    value: (()=>{
        const _value = _init_b(Foo, 123);
        _init_extra_b(Foo);
        return _value;
    })()
};
