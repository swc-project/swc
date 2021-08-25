var _brand_check_foo = new WeakSet();
class Foo {
    get #foo() {
    }
    test(other) {
        return _brand_check_foo.has(other);
    }
    constructor(){
        _brand_check_foo.add(this);
    }
}
