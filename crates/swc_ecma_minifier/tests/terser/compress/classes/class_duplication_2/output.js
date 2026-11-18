leak(class Foo {
    foo() {
        leak(new Foo());
    }
});
