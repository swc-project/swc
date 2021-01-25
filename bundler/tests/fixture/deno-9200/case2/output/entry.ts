const mod = function() {
    function foo() {
    }
    const foo1 = foo;
    return {
        foo: foo1
    };
}();
const lib1 = mod;
const foo1 = mod.foo;
export { foo1 as foo };
export { lib1 as lib };
