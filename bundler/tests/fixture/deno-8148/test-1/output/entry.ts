const mod = function() {
    class A {
    }
    const A1 = A;
    return {
        A
    };
}();
const foo = mod;
export { foo };
