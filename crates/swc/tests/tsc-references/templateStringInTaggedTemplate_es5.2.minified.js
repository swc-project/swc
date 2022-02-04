function _templateObject() {
    var strings, raw, data = (strings = [
        "I ",
        " THE TEMPLATE PORTION"
    ], raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    })));
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
("I AM THE TAG  PORTION")(_templateObject(), "AM");
