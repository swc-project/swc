const mod = function() {
    class A {
    }
    const A1 = A;
    return {
        A: A
    };
}();
export { mod as foo };
