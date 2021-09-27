var _tmp, _brand_check_foo = new WeakSet();
class Foo {
    #foo = (_tmp = 1, _brand_check_foo.add(this), _tmp);
    test() {
        class Nested {
            test() {
                _brand_check_foo.has(this);
            }
        }
        _brand_check_foo.has(this);
    }
}
