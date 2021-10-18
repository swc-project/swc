function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "Hello ",
        " world!"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function declare(x) {
    for(var _len = arguments.length, ys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        ys[_key - 1] = arguments[_key];
    }
}
declare(_templateObject(), 0);
