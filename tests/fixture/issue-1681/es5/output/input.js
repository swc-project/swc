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
        "a\nb\nc\n"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "a\nb\nc\n"
    ], [
        "a\\nb\\nc\\n"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
console.log(String.raw(_templateObject()));
console.log(String.raw(_templateObject1()));
