const mod = function() {
    async function foo() {
    }
    return {
        foo: foo
    };
}();
const foo = mod;
export { foo };
