const mod = function() {
    function foo() {
    }
    const foo1 = foo;
    return {
        foo: foo1
    };
}();
const foo = mod.foo;
const foo1 = foo;
const foo2 = foo1;
const foo3 = foo2;
foo3();
