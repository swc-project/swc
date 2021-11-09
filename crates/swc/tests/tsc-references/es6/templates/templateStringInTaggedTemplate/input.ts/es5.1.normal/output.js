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
        "I ",
        " THE TEMPLATE PORTION"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
("I AM THE TAG  PORTION")(_templateObject(), "AM");
