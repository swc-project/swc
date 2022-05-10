class G<T> {}
class Foo {
    constructor() {
        class Foo {}

        new G<Foo>();
    }
}
new G<Foo>();
