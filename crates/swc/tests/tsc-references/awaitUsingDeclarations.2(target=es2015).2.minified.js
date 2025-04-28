//// [awaitUsingDeclarations.2.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
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
            [Symbol.asyncDispose]: ()=>_async_to_generator(function*() {})()
        }, !0), _ts_add_disposable_resource(env, {
            [Symbol.asyncDispose]: ()=>_async_to_generator(function*() {})()
        }, !0);
    } catch (e) {
        env.error = e, env.hasError = !0;
    } finally{
        let result = _ts_dispose_resources(env);
        result && await result;
    }
}
