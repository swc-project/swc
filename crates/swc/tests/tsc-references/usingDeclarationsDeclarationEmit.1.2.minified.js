//// [usingDeclarationsDeclarationEmit.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
const env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    var r1 = _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {}
    }, !1), r2 = _ts_add_disposable_resource(env, {
        async [Symbol.asyncDispose] () {}
    }, !0);
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    const result = _ts_dispose_resources(env);
    result && await result;
}
export { r1, r2 };
