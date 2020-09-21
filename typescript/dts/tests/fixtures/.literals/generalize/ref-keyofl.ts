interface Foo<A, B extends keyof A> {
}

declare function foo(): Foo<any, 'foo' | 'bar'>;

let a = foo();