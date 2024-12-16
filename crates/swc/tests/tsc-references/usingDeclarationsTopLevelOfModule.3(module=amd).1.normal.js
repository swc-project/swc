//// [usingDeclarationsTopLevelOfModule.3.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(require, exports, _ts_add_disposable_resource, _ts_dispose_resources) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "y", {
        enumerable: true,
        get: function() {
            return y;
        }
    });
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        const z = _ts_add_disposable_resource._(env, {
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
        _ts_dispose_resources._(env);
    }
});
