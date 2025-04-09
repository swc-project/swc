class Foo {
    foo() {
        return /*#__PURE__*/ _async_to_generator(function*() {
            var wat = yield bar();
        })();
    }
}
