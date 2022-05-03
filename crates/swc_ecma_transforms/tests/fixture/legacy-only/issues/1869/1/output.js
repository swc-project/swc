var _class;
let TestClass = _class = someClassDecorator((_class = class TestClass {
    static Something = 'hello';
    static SomeProperties = {
        firstProp: TestClass.Something
    };
}) || _class) || _class;
function someClassDecorator(c) {
    return c;
}
