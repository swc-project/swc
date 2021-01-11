const mod = function() {
    function Foo(name) {
        return 'foo' + name;
    }
    return {
        Foo
    };
}();
const foo = mod;
const Foo = mod.Foo;
const Foo1 = Foo;
const bar = Foo1('bar');
const __default = bar;
const __default1 = __default;
const bar1 = __default1;
console.log(foo, bar1);
