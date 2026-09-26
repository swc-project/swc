let _TestClass;
class TestClass {
    static{
        _TestClass = this;
    }
    static Something = "hello";
    static SomeProperties = {
        firstProp: _TestClass.Something
    };
}
TestClass = _TestClass = _ts_decorate([
    someClassDecorator
], TestClass);
function someClassDecorator(c) {
    return c;
}
