class Foo {
    foo() {
        leak(new Foo());
    }
}
const default_export = Foo;
export { default_export as default };
