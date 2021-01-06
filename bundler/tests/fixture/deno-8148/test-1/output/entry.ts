const mod = function() {
    class A {
    }
    return {
        A: A
    };
}();
const foo = mod;
export { foo };
