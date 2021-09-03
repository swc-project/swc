
enum Foo {
    name: string
}

function foo() {
    enum Foo {
        name: string
    }
    const foo = {} as Foo;
}
const bar = {} as Foo;

