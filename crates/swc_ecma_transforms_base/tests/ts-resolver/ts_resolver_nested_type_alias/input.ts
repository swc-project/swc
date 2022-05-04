type Foo = {};

function foo() {
    type Foo = string | number;
    const foo = {} as Foo;
}
const bar = {} as Foo;
