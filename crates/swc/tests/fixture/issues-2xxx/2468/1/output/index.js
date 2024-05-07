var _tagged_template_literal = require("@swc/helpers/_/_tagged_template_literal");
function _templateObject() {
    var data = _tagged_template_literal._([
        "1"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal._([
        "2"
    ]);
    _templateObject1 = function _templateObject() {
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
