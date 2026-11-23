const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var res = _ts_add_disposable_resource(env, null, false);
    var _default = {
        default: class {
            static name2 = this.name;
        }
    }.default;
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { _default as default };
