var tag;
function _templateObject() {
    var strings, raw, data = (strings = [
        "Hello world!"
    ], raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    })));
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
tag(_templateObject());
