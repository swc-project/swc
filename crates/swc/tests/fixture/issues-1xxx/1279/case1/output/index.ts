export class Foo {
    nested() {
        let Foo1 = class Foo {
        };
        Foo1.foo = "foo";
        Foo1.bar = Foo1.foo;
        return new Foo1();
    }
}
