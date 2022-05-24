import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
function _templateObject() {
    var data = _tagged_template_literal([
        "1"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "2"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
function myTag(strings) {}
function f1() {
    return myTag(_templateObject());
}
function f2() {
    return myTag(_templateObject1());
}
