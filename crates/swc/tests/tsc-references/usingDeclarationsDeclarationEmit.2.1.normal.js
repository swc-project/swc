//// [usingDeclarationsDeclarationEmit.2.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    const r1 = _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {}
    }, false);
    const r2 = _ts_add_disposable_resource(env, {
        async [Symbol.asyncDispose] () {}
    }, true);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    const result = _ts_dispose_resources(env);
    if (result) await result;
}
export { };
