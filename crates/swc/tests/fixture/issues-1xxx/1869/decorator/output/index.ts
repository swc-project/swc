import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
var _TestClass;
var TestClass = (_TestClass = function TestClass() {
    "use strict";
    _class_call_check(this, TestClass);
}, _define_property(_TestClass, "Something", "hello"), _define_property(_TestClass, "SomeProperties", {
    firstProp: _TestClass.Something
}), _TestClass);
TestClass = _ts_decorate([
    someClassDecorator
], TestClass);
function someClassDecorator(c) {
    return c;
}
