class G<T> {}
class Foo {
    get foo() {
        class Foo {}

        new G<Foo>();
    }
}
