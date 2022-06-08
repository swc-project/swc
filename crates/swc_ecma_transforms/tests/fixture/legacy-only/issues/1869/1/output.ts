let TestClass = class TestClass1 {
    static Something = "hello";
    static SomeProperties = {
        firstProp: TestClass1.Something
    };
};
TestClass = __decorate([
    someClassDecorator
], TestClass);
function someClassDecorator(c) {
    return c;
}
