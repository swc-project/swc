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
        ""
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "",
        ""
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
function foo1() {
    for(var _len = arguments.length, stuff = new Array(_len), _key = 0; _key < _len; _key++)stuff[_key] = arguments[_key];
}
function foo2() {
    for(var _len = arguments.length, stuff = new Array(_len), _key = 0; _key < _len; _key++)stuff[_key] = arguments[_key];
}
foo1(_templateObject(), 1), foo1([], 1), foo2(_templateObject1(), 1), foo2([], 1);
