{
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        const a = _ts_add_disposable_resource(env, 1, false);
        const b = _ts_add_disposable_resource(env, 2, true);
        const c = _ts_add_disposable_resource(env, 3, false);
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        const result = _ts_dispose_resources(env);
        if (result) await result;
    }
}
