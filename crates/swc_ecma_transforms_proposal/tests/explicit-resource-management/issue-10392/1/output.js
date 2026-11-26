export class C {
    [Symbol.dispose]() {
        console.log("dispose");
    }
}
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var _ = _ts_add_disposable_resource(env, new C(), false);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
