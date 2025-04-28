export default function foo(x) {
    return _async_to_generator(function*() {
        function bar(y) {
            return _async_to_generator(function*() {
                y(x);
            })();
        }
    })();
}
