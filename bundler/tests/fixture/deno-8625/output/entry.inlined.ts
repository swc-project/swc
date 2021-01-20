const mod = function() {
    function Foo(name) {
        return 'foo' + name;
    }
    return {
        Foo
    };
}();
const Foo = mod.Foo;
const bar = Foo('bar');
console.log(mod, bar);
