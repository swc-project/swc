function x() {
    class Foo {}
    Foo.bar;
    class Bar {}
    Bar.foo;
}
function y() {
    var Foo = class Foo {};
    Foo.bar;
    var Bar = class Bar {};
    Bar.bar;
}
