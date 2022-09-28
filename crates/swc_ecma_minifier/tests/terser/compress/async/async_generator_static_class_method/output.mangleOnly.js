class a {
    static async *bar() {
        yield await Promise.resolve(4);
    }
}
