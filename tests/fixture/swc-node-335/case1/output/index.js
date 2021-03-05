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
let Foo = class Foo {
    method() {
        let Foo1 = class Foo {
        };
    }
};
_defineProperty(Foo, "a", 1);
