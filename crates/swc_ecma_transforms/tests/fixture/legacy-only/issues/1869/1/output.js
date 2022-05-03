let TestClass = class TestClass {
    static Something = 'hello';
    static SomeProperties = {
        firstProp: TestClass.Something
    };
};
TestClass = __decorate([
    someClassDecorator
], TestClass);
function someClassDecorator(c) {
    return c;
}
