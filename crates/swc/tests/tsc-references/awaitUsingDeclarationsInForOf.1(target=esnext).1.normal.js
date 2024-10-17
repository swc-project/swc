//// [awaitUsingDeclarationsInForOf.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
async function main() {
    for (const _ of [
        {
            async [Symbol.asyncDispose] () {}
        },
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
            const d1 = _ts_add_disposable_resource(env, _, true);
            {}
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
        }
    }
}
