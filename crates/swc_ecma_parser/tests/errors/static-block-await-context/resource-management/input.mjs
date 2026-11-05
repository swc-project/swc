class C {
    static {
        await using direct = null;
        { await using nested = null; }
        for await (const value of []) {}
        { for await (const value of []) {} }
        for (await using value of []) {}
        async function nested() {
            class D {
                static {
                    await using resource = null;
                    for await (const value of []) {}
                }
            }
        }
    }
}
