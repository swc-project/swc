interface Foo {
    name: string;
}

function foo() {
    interface Foo {
        name: string;
    }
    const foo = {} as Foo;
}
const bar = {} as Foo;
