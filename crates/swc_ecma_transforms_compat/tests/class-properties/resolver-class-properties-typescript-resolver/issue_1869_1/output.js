class TestClass {
}
_define_property(TestClass, "Something", 'hello');
_define_property(TestClass, "SomeProperties", {
    firstProp: TestClass.Something
});
function someClassDecorator(c) {
    return c;
}
