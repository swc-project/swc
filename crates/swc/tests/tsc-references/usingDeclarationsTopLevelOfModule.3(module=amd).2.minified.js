//// [usingDeclarationsTopLevelOfModule.3.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(require, exports, _ts_add_disposable_resource, _ts_dispose_resources) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "y", {
        enumerable: !0,
        get: function() {
            return y;
        }
    });
    let env = {
        stack: [],
        error: void 0,
        hasError: !1
    };
    try {
        var y;
        _ts_add_disposable_resource._(env, {
            [Symbol.dispose] () {}
        }, !1);
    } catch (e) {
        env.error = e, env.hasError = !0;
    } finally{
        _ts_dispose_resources._(env);
    }
});
