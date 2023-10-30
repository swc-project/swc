export default function foo(x) {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*(x) {
        function bar(y) {
            return _bar.apply(this, arguments);
        }
        function _bar() {
            _bar = _async_to_generator(function*(y) {
                y(x);
            });
            return _bar.apply(this, arguments);
        }
    });
    return _foo.apply(this, arguments);
}
