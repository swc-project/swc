//// [usingDeclarationsWithLegacyClassDecorators.10.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
export default class _class {
}
_class = _ts_decorate([
    dec
], _class);
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var after = _ts_add_disposable_resource(env, null, false);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
