export class Foo {
    private constructor(foo = new Set<string>()) {}
}

export class Bar {
    private constructor(readonly x: number, foo = new Set<string>()) {}
}
