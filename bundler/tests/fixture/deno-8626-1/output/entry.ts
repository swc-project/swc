const foo = 'bar';
const bar = 123;
const mod = function() {
    return {
        foo: foo,
        bar: bar
    };
}();
console.log(mod);
