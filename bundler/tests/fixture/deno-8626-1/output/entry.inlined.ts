const mod = function() {
    const foo = 'bar';
    const foo1 = foo;
    const bar = 123;
    return {
        foo: foo,
        bar: 123
    };
}();
console.log(mod);
