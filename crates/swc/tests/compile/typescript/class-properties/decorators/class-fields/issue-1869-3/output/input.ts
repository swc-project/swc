var _TestClass;
var _class;
let TestClass = _class = someClassDecorator((_class = (_TestClass = class TestClass {
}, _TestClass.Something = 'hello', _TestClass.SomeProperties = {
    firstProp: _TestClass.Something
}, _TestClass)) || _class) || _class;
function someClassDecorator(c) {
    return c;
}
