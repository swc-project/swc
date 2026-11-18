class C {
    static {
        const object = { await: null };
        object.await;
        object?.await;
        async function nested() { for await (const value of []) {} }
        const arrow = async () => { for await (const value of []) {} };
        class D {
            async method() { for await (const value of []) {} }
            field = async () => { for await (const value of []) {} };
        }
    }
}
