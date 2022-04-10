import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        "test"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = swcHelpers.taggedTemplateLiteral([
        "test"
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
var Foo = function() {
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return Foo.m = function(strings) {
        return new this();
    }, Foo;
}();
Foo.m(_templateObject()), Foo.m(_templateObject1());
