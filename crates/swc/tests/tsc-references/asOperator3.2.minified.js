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
tag(_templateObject(), 123), tag(_templateObject1());
