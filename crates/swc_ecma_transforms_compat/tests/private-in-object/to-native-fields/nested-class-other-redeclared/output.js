var _tmp2, _tmp1, _brand_check_foo1 = new WeakSet(), _brand_check_bar1 = new WeakSet();
class Foo {
    #foo = (_tmp2 = 1, _brand_check_foo1.add(this), _tmp2);
    #bar = (_tmp1 = 1, _brand_check_bar1.add(this), _tmp1);
    test() {
        var _tmp2, _brand_check_bar1 = new WeakSet();
        class Nested {
            #bar = (_tmp2 = 2, _brand_check_bar1.add(this), _tmp2);
        var _tmp, _brand_check_bar = new WeakSet();
        class Nested {
            #bar = (_tmp = 2, _brand_check_bar.add(this), _tmp);
            test() {
                _brand_check_foo.has(this);
                _brand_check_bar.has(this);
            }
        }
        _brand_check_foo1.has(this);
        _brand_check_bar1.has(this);
    }
}
