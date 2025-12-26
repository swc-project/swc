var _bar = /*#__PURE__*/ new WeakMap();
class Foo {
    static test() {
        return Foo === Foo;
    }
    test() {
        return _bar.has(this);
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
