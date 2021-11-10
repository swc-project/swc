interface Foo {
    new();
    (foo: string): void;
    [foo: string]: void;
}