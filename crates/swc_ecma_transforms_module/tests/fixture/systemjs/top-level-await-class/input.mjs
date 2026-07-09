class Derived extends (await getBase()) {
    [await getName()]() {}

    async method() {
        await work();
    }
}
