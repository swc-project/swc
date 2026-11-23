let value = 1;
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var r = _ts_add_disposable_resource(env, null, false);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export default value;
export class C {
    static{
        value = 2;
    }
}
