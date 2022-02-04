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
        " World"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "Hello"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
var a = "".concat(123 + 456);
var b = "leading ".concat(123 + 456);
var c = "".concat(123 + 456, " trailing");
var d = "Hello ".concat(123, " World");
var e = "Hello";
var f = 1 + "".concat(1, " end of string");
var g = tag(_templateObject(), 123);
var h = tag(_templateObject1());
