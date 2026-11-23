const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var res = _ts_add_disposable_resource(env, null, false);
    var a = 1;
    /*! @license notice */ var b = 2, c = 3;
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
/** Documentation for a. */ export { a };
export { b, c };
