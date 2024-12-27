{
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        const x = _ts_add_disposable_resource(env, obj, false);
        doSomethingWith(x);
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        _ts_dispose_resources(env);
    }
}
