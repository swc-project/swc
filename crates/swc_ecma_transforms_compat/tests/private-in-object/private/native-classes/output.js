var _foo = new WeakMap(), _bar = new WeakMap();
class Foo {
    static test() {
        return _brand_check_foo.has(Foo);
    }
    test() {
        return _brand_check_bar.has(this);
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
