export default function(x) {
    return _async_to_generator(function*() {
        function bar(y) {
            return _async_to_generator(function*() {
                ((z)=>_async_to_generator(function*() {
                        return x(y)(z);
                    })())();
            })();
        }
    })();
}
