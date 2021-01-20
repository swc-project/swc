const mod = function() {
    class A {
    }
    const A1 = A;
    return {
        A: A
    };
}();
const foo = mod;
export { mod as foo };
