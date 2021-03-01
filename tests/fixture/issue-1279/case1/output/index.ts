function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
export let Foo = class Foo {
    nested() {
        let Foo1 = class Foo {
        };
        _defineProperty(Foo1, "foo", 'foo');
        _defineProperty(Foo1, "bar", Foo1.foo);
        return new Foo1();
    }
};
