function _templateObject() {
    var strings, raw, data = (strings = [
        "Hello ",
        " world!"
    ], raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    })));
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
!function(x) {
    for(var _len = arguments.length, ys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)ys[_key - 1] = arguments[_key];
}(_templateObject(), 0);
