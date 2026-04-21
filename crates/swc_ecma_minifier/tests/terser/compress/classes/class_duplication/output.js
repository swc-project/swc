export default (class Foo {
    foo() {
        leak(new Foo());
    }
});
