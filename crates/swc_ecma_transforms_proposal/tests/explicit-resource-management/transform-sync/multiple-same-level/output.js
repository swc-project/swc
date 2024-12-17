{
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        stmt;
        const x = _ts_add_disposable_resource(env, obj, false);
        stmt;
        const y = _ts_add_disposable_resource(env, obj, false), z = _ts_add_disposable_resource(env, obj, false);
        stmt;
        const w = _ts_add_disposable_resource(env, obj, false);
        doSomethingWith(x, z);
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        _ts_dispose_resources(env);
    }
}
