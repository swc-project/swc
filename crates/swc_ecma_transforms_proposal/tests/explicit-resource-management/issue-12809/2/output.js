const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var res = _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {
            console.log(a, b, c, d);
        }
    }, false);
    var { a, b: [b] } = {
        a: 1,
        b: [
            2
        ]
    }, c = 3;
    var d;
    d = 4;
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { a, b, c };
export { d };
