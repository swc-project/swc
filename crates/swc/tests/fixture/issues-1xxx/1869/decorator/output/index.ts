import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _ts_decorate from "@swc/helpers/lib/_ts_decorate.js";
var _TestClass;
var TestClass = (_TestClass = function TestClass() {
    "use strict";
    _class_call_check(this, TestClass);
}, _TestClass.Something = "hello", _TestClass.SomeProperties = {
    firstProp: _TestClass.Something
}, _TestClass);
TestClass = _ts_decorate([
    someClassDecorator
], TestClass);
function someClassDecorator(c) {
    return c;
}
