var _call_a, _initStatic;
const dec = ()=>{};
class Foo {
    static callA() {
        return _class_static_private_field_spec_get(this, Foo, _a).call(Foo);
    }
}
var _a = {
    get: get_a,
    set: void 0
};
(()=>{
    ({ e: [_call_a, _initStatic] } = _apply_decs_2203_r(Foo, [
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
})();
_define_property(Foo, "value", 1);
function get_a() {
    return _call_a;
}
