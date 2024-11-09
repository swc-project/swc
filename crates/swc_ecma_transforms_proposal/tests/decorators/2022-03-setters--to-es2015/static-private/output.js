var _call_a, _initStatic;
const dec = ()=>{};
class Foo {
    static setA(v) {
        _class_static_private_field_spec_set(this, Foo, _a, v);
    }
}
var _a = {
    get: void 0,
    set: set_a
};
(()=>{
    ({ e: [_call_a, _initStatic] } = _apply_decs_2203_r(Foo, [
        [
            dec,
            9,
            "a",
            function(v) {
                return this.value = v;
            }
        ]
    ], []));
    _initStatic(Foo);
})();
_define_property(Foo, "value", 1);
function set_a(v) {
    return _call_a(this, v);
}
