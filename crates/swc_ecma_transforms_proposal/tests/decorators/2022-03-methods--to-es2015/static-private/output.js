var _call_a, _initStatic;
const dec = ()=>{};
class Foo {
    static callA() {
        return _class_static_private_field_spec_get(this, Foo, _a).call(Foo);
    }
}
var __ = {
    writable: true,
    value: (()=>{
        ({ e: [_call_a, _initStatic]  } = _apply_decs_2203_r(Foo, [
            [
                dec,
                7,
                "a",
                function() {
                    return this.value;
                }
            ]
        ], []));
        _initStatic(Foo);
    })()
};
_define_property(Foo, "value", 1);
var _a = {
    writable: true,
    value: _call_a
};
