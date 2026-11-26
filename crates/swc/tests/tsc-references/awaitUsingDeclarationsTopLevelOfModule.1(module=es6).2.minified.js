//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
export const x = 1;
let env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    var z = _ts_add_disposable_resource(env, {
        async [Symbol.asyncDispose] () {}
    }, !0), y = 2, w = 3, _default = 4;
    console.log(w, 1, y, z);
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    let result = _ts_dispose_resources(env);
    result && await result;
}
export { y, w, _default as default };
