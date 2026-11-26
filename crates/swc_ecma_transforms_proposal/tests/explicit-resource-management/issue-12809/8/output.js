const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var res = _ts_add_disposable_resource(env, null, false);
    /** @type {number | string} */ var port = 42;
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { port };
