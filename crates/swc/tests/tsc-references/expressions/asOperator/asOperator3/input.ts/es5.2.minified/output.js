function _taggedTemplateLiteral(strings, raw) {
    return raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "Hello ",
        " World"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "Hello"
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
"".concat(579), "leading ".concat(579), "".concat(579, " trailing"), "Hello ".concat(123, " World"), 1 + "".concat(1, " end of string"), tag(_templateObject(), 123), tag(_templateObject1());
