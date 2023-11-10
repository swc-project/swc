function _templateObject() {
    const data = _tagged_template_literal([
        "wow"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function _templateObject1() {
    const data = _tagged_template_literal([
        "first",
        "second"
    ]);
    _templateObject1 = function() {
        return data;
    };
    return data;
}
var foo = tag(_templateObject());
var bar = tag(_templateObject1(), 1);
