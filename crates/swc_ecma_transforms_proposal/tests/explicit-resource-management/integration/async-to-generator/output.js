async function fn() {
    await 0;
    {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const x = _ts_add_disposable_resource(env, y, true);
            await 1;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
        }
    }
}
