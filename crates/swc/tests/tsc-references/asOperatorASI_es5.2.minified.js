import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
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
