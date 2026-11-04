function one(a, b = 1) {
    return _async_to_generator(function*() {})();
}
function two(a, b, ...c) {
    return _async_to_generator(function*() {})();
}
function three(a, b = 1, c, d = 3) {
    return _async_to_generator(function*() {})();
}
function four(a, b = 1, c, ...d) {
    return _async_to_generator(function*() {})();
}
function five(_0, _1) {
    return _async_to_generator(function*(a, { b }) {}).apply(this, arguments);
}
function six(_0) {
    return _async_to_generator(function*(a, { b } = {}) {}).apply(this, arguments);
}
