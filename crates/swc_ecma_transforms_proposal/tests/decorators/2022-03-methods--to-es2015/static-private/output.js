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
        [_call_a, _initStatic] = _applyDecs2203R(Foo, [
            [
                dec,
                7,
                "a",
                function() {
                    return this.value;
                }
            ]
        ], []).e;
        _initStatic(Foo);
    })()
};
_define_property(Foo, "value", 1);
var _a = {
    writable: true,
    value: _call_a
};
