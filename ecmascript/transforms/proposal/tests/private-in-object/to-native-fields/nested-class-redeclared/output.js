var _tmp, _brand_check_foo = new WeakSet();
class Foo {
    #foo = (_tmp = 1, _brand_check_foo.add(this), _tmp);
    test() {
        var _tmp1, _brand_check_foo1 = new WeakSet();
        class Nested {
            #foo = (_tmp1 = 2, _brand_check_foo1.add(this), _tmp1);
            test() {
                _brand_check_foo1.has(this);
            }
        }
        _brand_check_foo.has(this);
    }
}
