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
        "\"!\"4"
    ], [
        "\\x22\\x21\\x224"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
console.log(_templateObject());
