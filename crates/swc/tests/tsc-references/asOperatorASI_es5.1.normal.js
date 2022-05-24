import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
function _templateObject() {
    var data = _tagged_template_literal([
        "Hello world"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
// Example 1
var x = 10;
as(_templateObject()); // should not error
// Example 2
var y = 20;
as(Foo); // should emit
