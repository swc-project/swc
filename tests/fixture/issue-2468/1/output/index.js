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
        "1"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "2"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
function myTag(strings) {
}
function f1() {
    return myTag(_templateObject());
}
function f2() {
    return myTag(_templateObject1());
}
