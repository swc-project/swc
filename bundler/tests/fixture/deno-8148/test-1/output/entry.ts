const mod = function() {
    class A {
    }
    const A1 = A;
    return {
        A: A1
    };
}();
const foo = mod;
export { foo };
