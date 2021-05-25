class Foo {
    async *bar() {
        yield await Promise.resolve(2);
    }
}
