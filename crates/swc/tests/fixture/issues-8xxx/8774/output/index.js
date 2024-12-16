var _ts_add_disposable_resource = require("@swc/helpers/_/_ts_add_disposable_resource");
var _ts_dispose_resources = require("@swc/helpers/_/_ts_dispose_resources");
const logClean = function() {
    return {
        [Symbol.dispose] () {
            console.log("clean in sync");
        },
        [Symbol.asyncDispose] () {
            console.log("clean in async");
        }
    };
};
async function foo() {
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        const a = _ts_add_disposable_resource._(env, logClean(), false);
        const b = _ts_add_disposable_resource._(env, logClean(), true);
        for (const _ of [
            logClean(),
            logClean()
        ]){
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const a = _ts_add_disposable_resource._(env, _, false);
                {}
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources._(env);
            }
        }
        for (const _ of [
            logClean(),
            logClean()
        ]){
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const a = _ts_add_disposable_resource._(env, _, true);
                {}
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                const result = _ts_dispose_resources._(env);
                if (result) await result;
            }
        }
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        const result = _ts_dispose_resources._(env);
        if (result) await result;
    }
}
foo();
