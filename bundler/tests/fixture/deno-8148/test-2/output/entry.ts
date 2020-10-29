const foo = function() {
    async function foo1() {
    }
    return {
        foo: foo1
    };
}();
export { foo };
