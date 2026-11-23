const log = [];
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var res = _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {
            console.log(log);
        }
    }, false);
    var _default = log.push("default");
    var named = log.push("named");
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { _default as default };
export { named };
