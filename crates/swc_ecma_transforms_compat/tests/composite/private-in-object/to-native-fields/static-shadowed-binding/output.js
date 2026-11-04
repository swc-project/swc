var _brand_check_foo = new WeakSet();
class A {
    static #foo = void _brand_check_foo.add(this);
    test() {
        let A = function fn(A) {
            return _brand_check_foo.has(A);
        };
    }
}
