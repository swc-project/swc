function foo(bar) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        bar && (yield bar());
    })();
}
