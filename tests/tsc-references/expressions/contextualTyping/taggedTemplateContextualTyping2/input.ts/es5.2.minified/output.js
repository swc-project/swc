function _taggedTemplateLiteral(strings, raw) {
    return raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "",
        "",
        ""
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "",
        "",
        "",
        ""
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
function _templateObject2() {
    var data = _taggedTemplateLiteral([
        "",
        "",
        "",
        ""
    ]);
    return _templateObject2 = function _templateObject2() {
        return data;
    }, data;
}
function tempTag2() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
}
tempTag2(_templateObject(), function(x) {
    return x(void 0), x;
}, 0), tempTag2(_templateObject1(), function(x) {
    return x(void 0), x;
}, function(y) {
    return y(null), y;
}, "hello"), tempTag2(_templateObject2(), function(x) {
    return x(void 0), x;
}, void 0, "hello");
