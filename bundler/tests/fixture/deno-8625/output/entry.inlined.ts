function Foo(name) {
    return 'foo' + name;
}
const mod = function() {
    return {
        Foo: Foo
    };
}();
const bar = Foo('bar');
console.log(mod, bar);
