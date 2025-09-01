//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
let env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    var z = _ts_add_disposable_resource(env, {
        async [Symbol.asyncDispose] () {}
    }, !0), y = 2;
    console.log(w, x, y, z);
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    let result = _ts_dispose_resources(env);
    result && await result;
}
export const x = 1;
export const w = 3;
export default 4;
export { y };
