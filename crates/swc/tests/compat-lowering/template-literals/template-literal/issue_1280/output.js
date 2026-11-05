function _templateObject() {
    const data = _tagged_template_literal([
        "'Hello'"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
const myVar = T(_templateObject());
