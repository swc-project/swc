class Foo {
    static test() {
        return Foo === Foo;
    }
    test() {
        return _bar.has(this);
    }
    constructor(){
        _bar.set(this, {
            writable: true,
            value: "bar"
        });
    }
}
var _foo = {
    writable: true,
    value: "foo"
};
var _bar = new WeakMap();
