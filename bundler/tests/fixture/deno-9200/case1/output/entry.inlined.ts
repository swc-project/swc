const mod = function() {
    function foo() {
    }
    const foo1 = foo;
    return {
        foo: foo
    };
}();
const foo = mod.foo;
foo();
