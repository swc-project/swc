export class Foo {

    nested() {
        class Foo { }

        return new Foo()
    }
}