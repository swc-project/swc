//// [usingDeclarationsTopLevelOfModule.3.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    const z = _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {}
    }, false);
    if (false) {
        var y = 1;
    }
    function f() {
        console.log(y, z);
    }
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { y };
