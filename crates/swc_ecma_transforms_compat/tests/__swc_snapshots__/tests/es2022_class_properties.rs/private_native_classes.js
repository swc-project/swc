var _foo = new WeakMap(), _bar = new WeakMap();
class Foo {
    static test() {
        return _class_private_field_get(Foo, _foo);
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
_foo.set(Foo, {
    writable: true,
    value: "foo"
});
