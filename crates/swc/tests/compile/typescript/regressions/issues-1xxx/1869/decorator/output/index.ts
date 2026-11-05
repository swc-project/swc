import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var TestClass = function TestClass() {
    "use strict";
    _class_call_check(this, TestClass);
};
_define_property(TestClass, "Something", "hello");
_define_property(TestClass, "SomeProperties", {
    firstProp: TestClass.Something
});
TestClass = _ts_decorate([
    someClassDecorator
], TestClass);
function someClassDecorator(c) {
    return c;
}
