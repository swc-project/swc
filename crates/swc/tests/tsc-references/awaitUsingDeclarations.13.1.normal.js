//// [awaitUsingDeclarations.13.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    const x = _ts_add_disposable_resource(env, null, true);
    function f() {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const x = _ts_add_disposable_resource(env, null, true);
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
