const mod = function() {
    function foo() {
    }
    const foo1 = foo;
    return {
        foo: foo
    };
}();
const foo1 = mod.foo;
export { foo1 as foo };
export { mod as lib };
