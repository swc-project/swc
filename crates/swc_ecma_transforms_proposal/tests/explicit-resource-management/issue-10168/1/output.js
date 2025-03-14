const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var _ = _ts_add_disposable_resource(env, {
        [Symbol.dispose]: ()=>{}
    }, false);
    b();
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
function a() {}
export function b() {
    a();
}
