var _init_a, _init_b;
const dec = ()=>{};
class Foo {
}
var __ = {
    writable: true,
    value: (()=>{
        [_init_a, _init_b] = _applyDecs2203R(Foo, [
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
        ], []).e;
    })()
};
var _a = {
    writable: true,
    value: _init_a(Foo)
};
var _b = {
    writable: true,
    value: _init_b(Foo, 123)
};
