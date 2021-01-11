const mod = function() {
    const foo = 'bar';
    const foo1 = foo;
    const bar = 123;
    return {
        foo: foo1,
        bar
    };
}();
const foo = mod;
console.log(foo);
