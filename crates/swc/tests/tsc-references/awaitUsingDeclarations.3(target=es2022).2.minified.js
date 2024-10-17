//// [awaitUsingDeclarations.3.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
{
    let env = {
        stack: [],
        error: void 0,
        hasError: !1
    };
    try {
        _ts_add_disposable_resource(env, {
            async [Symbol.asyncDispose] () {}
        }, !0), _ts_add_disposable_resource(env, null, !0), _ts_add_disposable_resource(env, void 0, !0), _ts_add_disposable_resource(env, {
            [Symbol.dispose] () {}
        }, !0);
    } catch (e) {
        env.error = e, env.hasError = !0;
    } finally{
        let result = _ts_dispose_resources(env);
        result && await result;
    }
}
