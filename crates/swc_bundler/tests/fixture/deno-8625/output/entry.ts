function Foo(name) {
    return "foo" + name;
}
const mod = {
    Foo: Foo
};
const bar = Foo("bar");
console.log(mod, bar);
