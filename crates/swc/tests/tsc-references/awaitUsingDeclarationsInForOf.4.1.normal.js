//// [awaitUsingDeclarationsInForOf.4.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
// https://github.com/microsoft/TypeScript/issues/55555
{
    for (const _ of of){
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const of = _ts_add_disposable_resource(env, _, true);
            {}
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
        }
    }
    ;
}
