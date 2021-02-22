const foo = 'bar';
const bar = 123;
const mod = function() {
    return {
        foo: foo,
        bar
    };
}();
console.log(mod);
