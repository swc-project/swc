var _bar = new WeakMap();
class Foo {
    static test() {
        return _class_private_field_get(Foo, _bar);
    }
    test() {
        return _class_private_field_get(Foo, _bar);
    }
}
_bar.set(Foo, {
    writable: true,
    value: "foo"
});
expect("bar" in Foo).toBe(false);
expect(Foo.test()).toBe("foo");
expect(Foo.test()).toBe("foo");
