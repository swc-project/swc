const returnValue = "asdasd";
class TestClass2 {
    @deco public declare testProperty: Date;
}
function deco(target: any, key: string) {
    console.log(target, key);
    Object.defineProperty(target.constructor.prototype, key, {
        get: function () {
            return returnValue;
        },
        enumerable: true,
        configurable: true,
    });
}
console.log(TestClass2.prototype.testProperty);
const instance = new TestClass2();
expect(instance.testProperty).toBe(returnValue);
