class C {
    static {
        for await (const value of []) {}
        { for await (const value of []) {} }
        async function nested() {
            class D { static { for await (const value of []) {} } }
        }
    }
}
