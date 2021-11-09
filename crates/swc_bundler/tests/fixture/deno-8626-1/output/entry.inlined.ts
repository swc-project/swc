const foo = 'bar';
const mod = function() {
    return {
        foo: foo,
        bar: 123
    };
}();
console.log(mod);
