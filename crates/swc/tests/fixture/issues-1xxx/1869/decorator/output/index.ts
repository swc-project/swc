import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
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
