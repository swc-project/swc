const returnValue = "asdasd"
class TestClass2 {
    @deco public testProperty: Date;
}
function deco(target: any, key: string) {
    Object.defineProperty(target.constructor.prototype, key, {
        value: returnValue,
        enumerable: true,
        configurable: true,
    });
}
const instance = new TestClass2()
expect(instance.testProperty).toBe(returnValue)