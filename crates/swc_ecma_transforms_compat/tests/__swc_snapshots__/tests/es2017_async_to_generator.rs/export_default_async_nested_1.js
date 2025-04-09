export default function foo(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        function bar(y) {
            return /*#__PURE__*/ _async_to_generator(function*() {
                y(x);
            })();
        }
    })();
}
