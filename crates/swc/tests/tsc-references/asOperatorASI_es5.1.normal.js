import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        "Hello world"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
// Example 1
var x = 10;
as(_templateObject()); // should not error
// Example 2
var y = 20;
as(Foo); // should emit
