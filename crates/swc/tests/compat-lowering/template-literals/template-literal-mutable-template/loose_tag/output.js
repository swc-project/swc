function _templateObject() {
    const data = _tagged_template_literal_loose([
        "wow\na",
        "b ",
        ""
    ], [
        "wow\\na",
        "b ",
        ""
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function _templateObject1() {
    const data = _tagged_template_literal_loose([
        "wow\nab",
        " ",
        ""
    ], [
        "wow\\nab",
        " ",
        ""
    ]);
    _templateObject1 = function() {
        return data;
    };
    return data;
}
function _templateObject2() {
    const data = _tagged_template_literal_loose([
        "wow\naB",
        " ",
        ""
    ], [
        "wow\\naB",
        " ",
        ""
    ]);
    _templateObject2 = function() {
        return data;
    };
    return data;
}
var foo = bar(_templateObject(), 42, _.foobar());
var bar = bar(_templateObject1(), 42, _.foobar());
var bar = bar(_templateObject2(), 42, _.baz());
