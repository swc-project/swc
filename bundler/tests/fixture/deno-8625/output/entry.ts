const mod = function() {
    function Foo(name) {
        return 'foo' + name;
    }
    return {
        Foo
    };
}();
const Foo = mod.Foo;
const Foo1 = Foo;
const foo = mod;
const bar = Foo1('bar');
const __default = bar;
const bar1 = __default;
console.log(foo, bar1);
