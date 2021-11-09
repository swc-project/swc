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
        "Hello world!"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var tag;
tag(_templateObject());
