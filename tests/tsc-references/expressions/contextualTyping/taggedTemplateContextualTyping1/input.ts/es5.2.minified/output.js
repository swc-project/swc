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
function _templateObject3() {
    var data = _taggedTemplateLiteral([
        "",
        "",
        "",
        ""
    ]);
    return _templateObject3 = function _templateObject3() {
        return data;
    }, data;
}
function tempTag1() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
}
tempTag1(_templateObject(), function(x) {
    return x(void 0), x;
}, 10), tempTag1(_templateObject1(), function(x) {
    return x(void 0), x;
}, function(y) {
    return y(void 0), y;
}, 10), tempTag1(_templateObject2(), function(x) {
    return x(void 0), x;
}, function(y) {
    return y(void 0), y;
}, void 0), tempTag1(_templateObject3(), function(x) {
    return x(void 0), x;
}, function(y) {
    return y(void 0), y;
}, void 0);
