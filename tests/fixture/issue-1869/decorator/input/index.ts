@someClassDecorator
class TestClass {
    static Something = 'hello';

    static SomeProperties = {
        firstProp: TestClass.Something,
    };
}

function someClassDecorator(c) {
    return c;
}
