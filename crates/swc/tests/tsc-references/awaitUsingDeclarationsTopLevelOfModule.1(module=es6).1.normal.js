//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var x = 1;
    var z = _ts_add_disposable_resource(env, {
        async [Symbol.asyncDispose] () {}
    }, true);
    var y = 2;
    var w = 3;
    console.log(w, x, y, z);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    const result = _ts_dispose_resources(env);
    if (result) await result;
}
export { x };
export { y };
export { w };
export default 4;
