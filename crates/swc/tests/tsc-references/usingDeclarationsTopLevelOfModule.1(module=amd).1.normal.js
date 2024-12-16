//// [usingDeclarationsTopLevelOfModule.1.ts]
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
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        default: function() {
            return _default;
        },
        w: function() {
            return w;
        },
        x: function() {
            return x;
        },
        y: function() {
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
        const y = 2;
        console.log(w, x, y, z);
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        _ts_dispose_resources._(env);
    }
    const x = 1;
    const w = 3;
    const _default = 4;
});
