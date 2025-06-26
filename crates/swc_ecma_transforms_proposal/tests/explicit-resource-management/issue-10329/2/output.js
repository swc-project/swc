const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var counter = 0;
    var server = _ts_add_disposable_resource(env, test, true);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    const result = _ts_dispose_resources(env);
    if (result) await result;
}
async function httpServerStreamingResponse() {
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        function periodicStream() {
            console.log(counter);
        }
        let counter = 0;
        const server = _ts_add_disposable_resource(env, test, true);
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        const result = _ts_dispose_resources(env);
        if (result) await result;
    }
}
function periodicStream() {
    console.log(counter);
}
export function periodicStream2() {
    console.log(counter);
}
