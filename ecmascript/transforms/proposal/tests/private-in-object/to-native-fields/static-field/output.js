var _tmp, _brand_check_foo = new WeakSet();
class Foo {
    static #foo = (_tmp = 1, _brand_check_foo.add(this), _tmp);
    test(other) {
        return _brand_check_foo.has(other);
    }
}
