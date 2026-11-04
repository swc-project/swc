var foo = "bar";
class Foo {
    constructor(){
        this.bar = foo;
        var foo1 = "foo";
        var baz1 = "baz";
    }
}
Foo.bar = baz;
