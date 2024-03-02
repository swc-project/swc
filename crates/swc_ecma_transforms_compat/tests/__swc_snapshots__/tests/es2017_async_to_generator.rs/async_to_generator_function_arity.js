function one(a) {
    return _one.apply(this, arguments);
}
function _one() {
    _one = _async_to_generator(function*(a, b = 1) {});
    return _one.apply(this, arguments);
}
function two(a, b) {
    return _two.apply(this, arguments);
}
function _two() {
    _two = _async_to_generator(function*(a, b, ...c) {});
    return _two.apply(this, arguments);
}
function three(a) {
    return _three.apply(this, arguments);
}
function _three() {
    _three = _async_to_generator(function*(a, b = 1, c, d = 3) {});
    return _three.apply(this, arguments);
}
function four(a) {
    return _four.apply(this, arguments);
}
function _four() {
    _four = _async_to_generator(function*(a, b = 1, c, ...d) {});
    return _four.apply(this, arguments);
}
function five(a, _) {
    return _five.apply(this, arguments);
}
function _five() {
    _five = _async_to_generator(function*(a, { b }) {});
    return _five.apply(this, arguments);
}
function six(a) {
    return _six.apply(this, arguments);
}
function _six() {
    _six = _async_to_generator(function*(a, { b } = {}) {});
    return _six.apply(this, arguments);
}
