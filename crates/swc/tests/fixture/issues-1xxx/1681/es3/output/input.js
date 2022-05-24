import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
function _templateObject() {
    var data = _tagged_template_literal([
        "a\nb\nc\n"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
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
