let _init_a, _init_extra_a, _init_b, _init_extra_b;
const dec = ()=>{};
class Foo {
}
({ e: [_init_a, _init_extra_a, _init_b, _init_extra_b] } = _apply_decs_2311(Foo, [], [
    [
        dec,
        8,
        "a",
        function(_this) {
            return _class_static_private_field_spec_get(_this, Foo, _a);
        },
        function(_this, value) {
            _class_static_private_field_spec_set(_this, Foo, _a, value);
        }
    ],
    [
        dec,
        8,
        "b",
        function(_this) {
            return _class_static_private_field_spec_get(_this, Foo, _b);
        },
        function(_this, value) {
            _class_static_private_field_spec_set(_this, Foo, _b, value);
        }
    ]
]));
var _a = {
    writable: true,
    value: (()=>{
        const _value = _init_a();
        _init_extra_a();
        return _value;
    })()
};
var _b = {
    writable: true,
    value: (()=>{
        const _value = _init_b(123);
        _init_extra_b();
        return _value;
    })()
};
