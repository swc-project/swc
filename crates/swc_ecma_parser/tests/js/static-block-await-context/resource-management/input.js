class C {
    static {
        using resource = null;
        for (using value of []) {}
        const object = { await: null };
        object.await;
        object?.await;
        async function nested() {
            await using resource = null;
            for await (const value of []) {}
            for (await using value of []) {}
        }
        const arrow = async () => {
            await using resource = null;
            for await (const value of []) {}
            for (await using value of []) {}
        };
        const methods = {
            async method() {
                await using resource = null;
                for await (const value of []) {}
            }
        };
        class D {
            async method() {
                await using resource = null;
                for await (const value of []) {}
            }
            field = async () => {
                await using resource = null;
                for await (const value of []) {}
            };
        }
    }
}
