const foo = function foo(x, y, ...z) {
    return /*#__PURE__*/ _wrap_async_generator(function*() {
        if (x) {
            return foo(0, y);
        }
        return 0;
    })();
};
