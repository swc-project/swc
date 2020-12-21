const mod = function() {
    const foo = 'bar';
    const bar = 123;
    return {
        foo: foo,
        bar
    };
}();
const foo = mod;
console.log(foo);
