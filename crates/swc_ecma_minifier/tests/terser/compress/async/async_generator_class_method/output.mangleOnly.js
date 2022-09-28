class a {
    async *bar() {
        yield await Promise.resolve(2);
    }
}
