import * as swcHelpers from "@swc/helpers";
var _TestClass;
var _class;
var TestClass = _class = someClassDecorator((_class = (_TestClass = function TestClass() {
    "use strict";
    swcHelpers.classCallCheck(this, TestClass);
}, _TestClass.Something = "hello", _TestClass.SomeProperties = {
    firstProp: _TestClass.Something
}, _TestClass)) || _class) || _class;
function someClassDecorator(c) {
    return c;
}
