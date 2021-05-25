function x() {
    class Foo {}
    Foo.bar;
    class a {}
    a.foo;
}
function y() {
    var Foo = class Foo {};
    Foo.bar;
    var a = class a {};
    a.bar;
}
