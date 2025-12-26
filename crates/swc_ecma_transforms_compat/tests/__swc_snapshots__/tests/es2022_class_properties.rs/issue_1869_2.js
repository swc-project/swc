var TestClass;
var _class;
let TestClass1 = _class = someClassDecorator((_class = (TestClass = class TestClass {
}, _define_property(TestClass, "Something", 'hello'), _define_property(TestClass, "SomeProperties", {
    firstProp: TestClass.Something
}), TestClass)) || _class) || _class;
function someClassDecorator(c) {
    return c;
}
