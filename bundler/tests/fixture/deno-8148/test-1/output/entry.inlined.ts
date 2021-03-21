class A {
}
const mod = function() {
    return {
        A: A
    };
}();
export { mod as foo };
