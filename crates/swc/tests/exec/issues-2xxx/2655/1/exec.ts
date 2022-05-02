const testDecorator = <T>(target: T, key: keyof T) => {
    const privateField = Symbol();
    // We define getters and setters for the property on the prototype of the class
    // A real application might use this to intercept changes to the decorated property.
    // This is a simplified version of a pattern used by the @microsoft/fast-elements library.
    Reflect.defineProperty(target, key, {
        get: function () {
            console.log(`called getter for property ${key}.`)
            return (target as any)[privateField]
        },
        set: function (newValue) {
            console.log(`called setter for property ${key} with newValue ${newValue}.`)
            return (target as any)[privateField] = newValue
        }
    })
    console.log("called testDecorator!");
};

class TestClass {
    @testDecorator
    testProp = "hello"
}

const instance = new TestClass();
// SWC console output:
//    "called testDecorator!"
// TSC console output:
//    "called testDecorator!"
//    "called setter for property testProp with newValue hello"

instance.testProp = "goodbye";
// SWC console output:
//    <nothing>
// TSC console output:
//    "called setter for property testProp with newValue goodbye."

console.log("testProp is now", instance.testProp);
// SWC console output:
//    "testProps is now goodbye"
// TSC console output:
//    "called getter for property testProp."
//    "testProps is now goodbye"