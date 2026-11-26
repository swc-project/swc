//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
export const x = 1;
export { y };
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var z = _ts_add_disposable_resource(env, {
        async [Symbol.asyncDispose] () {}
    }, true);
    var y = 2;
    var w = 3;
    var _default = 4;
    console.log(w, x, y, z);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    const result = _ts_dispose_resources(env);
    if (result) await result;
}
export { w };
export { _default as default };
