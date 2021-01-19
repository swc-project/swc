async function* baz() {
    yield await Promise.resolve(1);
}
