function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _TestClass;
var _class;
var TestClass = _class = someClassDecorator((_class = (_TestClass = function TestClass() {
    "use strict";
    _classCallCheck(this, TestClass);
}, _TestClass.Something = 'hello', _TestClass.SomeProperties = {
    firstProp: _TestClass.Something
}, _TestClass)) || _class) || _class;
function someClassDecorator(c) {
    return c;
}
