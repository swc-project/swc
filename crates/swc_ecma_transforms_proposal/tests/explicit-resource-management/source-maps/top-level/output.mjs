const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    before;
    const x = _ts_add_disposable_resource(env, fn(), false);
    doSomethingWith(x);
    after;
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
