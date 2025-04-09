export default function(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        function bar(y) {
            return /*#__PURE__*/ _async_to_generator(function*() {
                ((z)=>/*#__PURE__*/ _async_to_generator(function*() {
                        return x(y)(z);
                    })())();
            })();
        }
    })();
}
