export class Foo {

    nested() {
        class Foo {
            static foo = 'foo';
            static bar = Foo.foo;
        }

        return new Foo()
    }
}