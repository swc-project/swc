class TestClass {
    static Something = "hello";
    static SomeProperties = {
        firstProp: TestClass.Something
    };
}
TestClass = _ts_decorate([
    someClassDecorator
], TestClass);
function someClassDecorator(c) {
    return c;
}
