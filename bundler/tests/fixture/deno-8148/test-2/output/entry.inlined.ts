async function foo1() {
}
const mod = function() {
    return {
        mod: foo1
    };
}();
export { mod as foo };
