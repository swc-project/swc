var _call_a, _call_a1, _initStatic;
const dec = ()=>{};
class Foo {
    static getA() {
        return _class_static_private_field_spec_get(this, Foo, _a);
    }
    static setA(v) {
        _class_static_private_field_spec_set(this, Foo, _a, v);
    }
}
var _a = {
    get: get_a,
    set: set_a
};
(()=>{
    ({ e: [_call_a, _call_a1, _initStatic] } = _apply_decs_2203_r(Foo, [
        [
            dec,
            8,
            "a",
            function() {
                return this.value;
            }
        ],
        [
            dec,
            9,
            "a",
            function(v) {
                this.value = v;
            }
        ]
    ], []));
    _initStatic(Foo);
})();
_define_property(Foo, "value", 1);
function get_a() {
    return _call_a(this);
}
function set_a(v) {
    return _call_a1(this, v);
}
