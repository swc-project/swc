class Foo {
    foo() {
        return _async_to_generator(function*() {
            var wat = yield bar();
        })();
    }
}
