class Foo {
    static bar = 42;
    static {
        this.foo = Foo.bar;
    }
}
