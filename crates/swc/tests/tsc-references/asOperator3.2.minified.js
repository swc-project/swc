//// [asOperator3.ts]
import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
function _templateObject() {
    var data = _tagged_template_literal([
        "Hello ",
        " World"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "Hello"
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
var a = "".concat(579), b = "leading ".concat(579), c = "".concat(579, " trailing"), d = "Hello ".concat(123, " World"), e = "Hello", f = 1 + "".concat(1, " end of string"), g = tag(_templateObject(), 123), h = tag(_templateObject1());
