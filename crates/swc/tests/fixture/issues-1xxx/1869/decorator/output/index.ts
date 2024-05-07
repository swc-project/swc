var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _define_property = require("@swc/helpers/_/_define_property");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var TestClass = function TestClass() {
    "use strict";
    _class_call_check._(this, TestClass);
};
_define_property._(TestClass, "Something", "hello");
_define_property._(TestClass, "SomeProperties", {
    firstProp: TestClass.Something
});
TestClass = _ts_decorate._([
    someClassDecorator
], TestClass);
function someClassDecorator(c) {
    return c;
}
