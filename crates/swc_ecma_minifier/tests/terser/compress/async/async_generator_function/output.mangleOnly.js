async function* a() {
    yield await Promise.resolve(1);
}
