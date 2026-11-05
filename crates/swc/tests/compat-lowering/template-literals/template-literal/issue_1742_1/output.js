function _templateObject() {
    const data = _tagged_template_literal([
        "template"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function foo() {
    return this;
}
foo(_templateObject());
