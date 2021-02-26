async function foo1() {
}
const mod = function() {
    return {
        foo: foo1
    };
}();
export { mod as foo };
