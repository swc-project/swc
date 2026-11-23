const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var log = [];
    var res = _ts_add_disposable_resource(env, {
        async [Symbol.asyncDispose] () {
            log.push(a, b, c);
        }
    }, true);
    var a = "a";
    var b = "b";
    var c = "c";
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    const result = _ts_dispose_resources(env);
    if (result) await result;
}
export { a };
export { b };
export { c };
export { log };
