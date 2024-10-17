//// [usingDeclarationsInForOf.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
for (const _ of [
    {
        [Symbol.dispose] () {}
    },
    null,
    undefined
]){
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        const d1 = _ts_add_disposable_resource(env, _, false);
        {}
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        _ts_dispose_resources(env);
    }
}
