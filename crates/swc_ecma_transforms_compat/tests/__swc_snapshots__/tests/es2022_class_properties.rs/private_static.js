class Foo {
    static test() {
        return _class_static_private_field_spec_get(Foo, Foo, _bar);
    }
    test() {
        return _class_static_private_field_spec_get(Foo, Foo, _bar);
    }
}
var _bar = {
    writable: true,
    value: "foo"
};
expect("bar" in Foo).toBe(false);
expect(Foo.test()).toBe("foo");
expect(Foo.test()).toBe("foo");
