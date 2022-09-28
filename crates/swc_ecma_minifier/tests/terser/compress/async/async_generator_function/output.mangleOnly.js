async function* e() {
    yield await Promise.resolve(1);
}
