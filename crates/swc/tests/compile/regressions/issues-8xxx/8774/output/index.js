import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
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
        const a = _ts_add_disposable_resource(env, logClean(), false);
        const b = _ts_add_disposable_resource(env, logClean(), true);
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
                const a = _ts_add_disposable_resource(env, _, false);
                {}
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
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
                const a = _ts_add_disposable_resource(env, _, true);
                {}
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                const result = _ts_dispose_resources(env);
                if (result) await result;
            }
        }
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        const result = _ts_dispose_resources(env);
        if (result) await result;
    }
}
foo();
