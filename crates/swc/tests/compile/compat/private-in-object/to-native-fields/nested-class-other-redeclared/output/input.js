var _tmp, _tmp1, _brand_check_foo1 = new WeakSet(), _brand_check_bar = new WeakSet();
class Foo {
    #foo = (_tmp = 1, _brand_check_foo1.add(this), _tmp);
    #bar = (_tmp1 = 1, _brand_check_bar.add(this), _tmp1);
    test() {
        var _tmp, _brand_check_bar1 = new WeakSet();
        class Nested {
            #bar = (_tmp = 2, _brand_check_bar1.add(this), _tmp);
            test() {
                _brand_check_foo.has(this);
                _brand_check_bar1.has(this);
            }
        }
        _brand_check_foo1.has(this);
        _brand_check_bar.has(this);
    }
}
