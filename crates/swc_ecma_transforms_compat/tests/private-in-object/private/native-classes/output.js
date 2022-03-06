var _bar = new WeakMap();
class Foo {
    static test() {
        return Foo === Foo;
    }
    test() {
        return _bar.has(this);
    }
    constructor(){
        _classPrivateFieldInit(this, _bar, {
            writable: true,
            value: "bar"
        });
    }
}
var _foo = {
    writable: true,
    value: "foo"
};
