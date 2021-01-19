class Foo {
    static async *bar() {
        yield await Promise.resolve(4);
    }
}
