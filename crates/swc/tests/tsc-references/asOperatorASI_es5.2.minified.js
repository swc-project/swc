import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
function _templateObject() {
    var data = _tagged_template_literal([
        "Hello world"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
};
as(_templateObject()), as(Foo);
