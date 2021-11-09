function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _class;
var _class1;
var TestClass1 = _class1 = someClassDecorator((_class1 = (_class = function TestClass() {
    "use strict";
    _classCallCheck(this, TestClass);
}, _class.Something = 'hello', _class.SomeProperties = {
    firstProp: _class.Something
}, _class)) || _class1) || _class1;
function someClassDecorator(c) {
    return c;
}
