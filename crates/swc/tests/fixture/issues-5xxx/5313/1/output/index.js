var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
function a() {
    return _a.apply(this, arguments);
}
function _a() {
    _a = _async_to_generator._(function*() {
        return true && (yield b)();
    });
    return _a.apply(this, arguments);
}
