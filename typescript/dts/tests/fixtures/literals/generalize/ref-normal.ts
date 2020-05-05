interface Foo<A, B> {
}

declare function foo(): Foo<any, 'foo' | 'bar'>;

let a = foo();