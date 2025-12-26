var _bar = /*#__PURE__*/ new WeakMap();
class Foo {
    static test() {
        return _class_static_private_field_spec_get(Foo, Foo, _foo);
    }
    test() {
        return _class_private_field_get(this, _bar);
    }
    constructor(){
        _class_private_field_init(this, _bar, {
            writable: true,
            value: "bar"
        });
    }
}
var _foo = {
    writable: true,
    value: "foo"
};
