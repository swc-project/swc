// Test: Object and class methods with unused default parameters

const obj = {
    // Method with unused default param
    method1(a, b = 10) {
        return a;
    },
    // Method with used default param
    method2(a, b = 20) {
        return a + b;
    }
};

class MyClass {
    // Method with unused default param
    method1(a, b = 30) {
        return a;
    }
    // Method with used default param
    method2(a, b = 40) {
        return a + b;
    }
    // Static method with unused default param
    static staticMethod(a, b = 50) {
        return a;
    }
}

export function example() {
    const instance = new MyClass();
    return obj.method1(1) + obj.method2(2) +
           instance.method1(3) + instance.method2(4) +
           MyClass.staticMethod(5);
}
