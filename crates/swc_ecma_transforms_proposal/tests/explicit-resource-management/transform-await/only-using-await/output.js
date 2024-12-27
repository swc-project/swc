{
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        const x = _ts_add_disposable_resource(env, obj, true);
        stmt;
        const y = _ts_add_disposable_resource(env, obj, true), z = _ts_add_disposable_resource(env, obj, true);
        doSomethingWith(x, y);
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        const result = _ts_dispose_resources(env);
        if (result) await result;
    }
}
