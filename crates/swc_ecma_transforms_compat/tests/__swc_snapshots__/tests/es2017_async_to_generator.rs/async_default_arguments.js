function mandatory(paramName) {
    throw new Error(`Missing parameter: ${paramName}`);
}
function foo(param) {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*(param) {
        let a = param.a, _param_b = param.b, b = _param_b === void 0 ? mandatory("b") : _param_b;
        return Promise.resolve(b);
    });
    return _foo.apply(this, arguments);
}
