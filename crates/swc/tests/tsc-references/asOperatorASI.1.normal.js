//// [asOperatorASI.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
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
