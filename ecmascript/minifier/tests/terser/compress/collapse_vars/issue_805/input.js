function f() {
    function Foo() {}
    Foo.prototype = {};
    Foo.prototype.bar = 42;
    return Foo;
}
console.log(new (f())().bar);
