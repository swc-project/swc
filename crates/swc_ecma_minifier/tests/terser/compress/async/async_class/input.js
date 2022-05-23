class Foo {
    async m1() {
        return await foo(1 + 2);
    }
    static async m2() {
        return await foo(3 + 4);
    }
}
