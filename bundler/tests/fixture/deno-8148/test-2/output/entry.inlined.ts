const mod = function() {
    async function foo() {
    }
    const foo1 = foo;
    return {
        foo: foo
    };
}();
const foo = mod;
export { foo };
