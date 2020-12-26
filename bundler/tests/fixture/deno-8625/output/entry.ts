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
const bar = Foo1('bar');
const foo = mod;
const __default = bar;
const bar1 = __default;
console.log(foo, bar1);
