//// [usingDeclarationsTopLevelOfModule.2.ts]
define([
    "require",
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(require, _ts_add_disposable_resource, _ts_dispose_resources) {
    "use strict";
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        const z = _ts_add_disposable_resource._(env, {
            [Symbol.dispose] () {}
        }, false);
        const y = 2;
        console.log(y, z);
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        _ts_dispose_resources._(env);
    }
    return 4;
});
