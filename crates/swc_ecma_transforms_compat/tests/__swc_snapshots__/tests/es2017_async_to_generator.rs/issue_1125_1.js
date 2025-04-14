function test() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        try {
            yield 1;
        } finally{
            console.log(2);
        }
    })();
}
test();
