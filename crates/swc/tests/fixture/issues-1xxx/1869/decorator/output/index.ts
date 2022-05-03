import * as swcHelpers from "@swc/helpers";
var TestClass = function TestClass() {
    "use strict";
    swcHelpers.classCallCheck(this, TestClass);
};
TestClass.Something = "hello";
TestClass.SomeProperties = {
    firstProp: TestClass.Something
};
swcHelpers.__decorate([
    someClassDecorator
], TestClass);
function someClassDecorator(c) {
    return c;
}
