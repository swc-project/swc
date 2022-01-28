foo({
    baz: 4,
    async *bar() {
        yield await Promise.resolve(3);
    },
    qux: qux,
});
