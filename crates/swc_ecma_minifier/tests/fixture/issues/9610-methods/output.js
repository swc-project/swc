// Test: Object and class methods with unused default parameters
class MyClass {
    // Method with unused default param
    method1(a) {
        return a;
    }
    // Method with used default param
    method2(a, b = 40) {
        return a + b;
    }
    // Static method with unused default param
    static staticMethod(a) {
        return a;
    }
}
export function example() {
    let instance = new MyClass();
    return(// Method with unused default param
    ((a)=>a)(1) + // Method with used default param
    ((a, b = 20)=>a + b)(2) + instance.method1(3) + instance.method2(4) + MyClass.staticMethod(5));
}
