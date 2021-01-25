const mod = function() {
    function foo() {
    }
    const foo1 = foo;
    return {
        foo: foo1
    };
}();
const foo1 = mod.foo;
export { foo1 as foo };
const lib1 = mod;
export { lib1 as lib };
