function _templateObject() {
    var strings, raw, data = (strings = [
        "abc",
        "def"
    ], raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    })));
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
new new new ((void 0)(_templateObject(), 0)).member("hello")(42);
