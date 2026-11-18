import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
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
    _templateObject1 = function _templateObject() {
        return data;
    };
    return data;
}
console.log(String.raw(_templateObject()));
console.log(String.raw(_templateObject1()));
