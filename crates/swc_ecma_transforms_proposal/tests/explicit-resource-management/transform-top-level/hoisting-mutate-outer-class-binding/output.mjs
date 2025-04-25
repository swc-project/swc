const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var A = class A {
        static get self() {
            return A;
        }
    };
    var x = _ts_add_disposable_resource(env, null, false);
    var B = class B {
        static get self() {
            return B;
        }
    };
    A = B = null;
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { A };
export { B };
