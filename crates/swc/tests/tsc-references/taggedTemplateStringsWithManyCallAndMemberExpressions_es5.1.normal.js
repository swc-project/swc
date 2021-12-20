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
        "abc",
        "def"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var f;
var x = new new new (f(_templateObject(), 0)).member("hello")(42) === true;
