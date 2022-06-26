import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
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
