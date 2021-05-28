class Foo {
    foo() {
        leak(new Foo());
    }
}
leak(Foo);
