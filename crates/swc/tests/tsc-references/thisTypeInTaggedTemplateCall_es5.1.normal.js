import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        "test"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = swcHelpers.taggedTemplateLiteral([
        "test"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
var Foo = // @target: esnext
/*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    Foo.m = function m(strings) {
        return new this();
    };
    return Foo;
}();
Foo.m(_templateObject());
Foo.m(_templateObject1());
