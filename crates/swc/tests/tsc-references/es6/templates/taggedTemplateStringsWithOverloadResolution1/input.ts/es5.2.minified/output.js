function _taggedTemplateLiteral(strings, raw) {
    return raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
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
function _templateObject2() {
    var data = _taggedTemplateLiteral([
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
        ""
    ]);
    return _templateObject3 = function _templateObject3() {
        return data;
    }, data;
}
function _templateObject4() {
    var data = _taggedTemplateLiteral([
        "",
        "",
        ""
    ]);
    return _templateObject4 = function _templateObject4() {
        return data;
    }, data;
}
function _templateObject5() {
    var data = _taggedTemplateLiteral([
        "",
        "",
        "",
        ""
    ]);
    return _templateObject5 = function _templateObject5() {
        return data;
    }, data;
}
function foo() {
    for(var _len = arguments.length, stuff = new Array(_len), _key = 0; _key < _len; _key++)stuff[_key] = arguments[_key];
}
foo([]), foo([], 1), foo([], 1, 2), foo([], 1, !0), foo([], 1, "2"), foo([], 1, 2, 3), foo(_templateObject()), foo(_templateObject1(), 1), foo(_templateObject2(), 1, 2), foo(_templateObject3(), 1, !0), foo(_templateObject4(), 1, "2"), foo(_templateObject5(), 1, 2, 3);
