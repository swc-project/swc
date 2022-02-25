enum Foo {
    hello = 42,
}

enum Foo2 {
    hello = "42",
}

const enum Bar {
    hello = 42,
}

const enum Bar2 {
    hello = "42",
}

console.log(Foo.hello, Foo2.hello);
console.log(Bar.hello, Bar2.hello);
