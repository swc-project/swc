const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var res = _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {
            console.log(value, N.inner);
        }
    }, false);
    var value: number = 1;
    namespace N {
        const env1 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var nested = _ts_add_disposable_resource(env1, {
                [Symbol.dispose] () {
                    console.log(inner);
                }
            }, false);
        } catch (e) {
            env1.error = e;
            env1.hasError = true;
        } finally{
            _ts_dispose_resources(env1);
        }
        export const inner = 2;
    }
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export declare const ambient: number;
export { value };
export { N };
