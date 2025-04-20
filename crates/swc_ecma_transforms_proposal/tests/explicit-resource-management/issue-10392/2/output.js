const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var C = class {
        [Symbol.dispose]() {
            console.log("dispose");
        }
    };
    var _ = _ts_add_disposable_resource(env, new C(), false);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { C as default };
