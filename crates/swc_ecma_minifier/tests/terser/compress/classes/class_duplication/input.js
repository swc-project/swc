class Foo {
    foo() {
        leak(new Foo());
    }
}
export default Foo;
