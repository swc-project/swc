const returnValue = "asdasd";
class TestClass {
    public testProperty: Date;
}

Object.defineProperty(TestClass.prototype, "testProperty", {
    get: function () {
        return returnValue;
    },
    enumerable: true,
    configurable: true,
});
const instance = new TestClass();
expect(instance.testProperty).toBe(returnValue);
