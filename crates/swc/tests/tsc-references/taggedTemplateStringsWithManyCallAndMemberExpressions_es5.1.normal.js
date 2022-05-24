import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
function _templateObject() {
    var data = _tagged_template_literal([
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
