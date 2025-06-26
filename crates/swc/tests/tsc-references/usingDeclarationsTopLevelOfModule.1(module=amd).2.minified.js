//// [usingDeclarationsTopLevelOfModule.1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(require, exports, _ts_add_disposable_resource, _ts_dispose_resources) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var all = {
        get default () {
            return _default;
        },
        get w () {
            return w;
        },
        get x () {
            return x;
        },
        get y () {
            return y;
        }
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
    let env = {
        stack: [],
        error: void 0,
        hasError: !1
    };
    try {
        var z = _ts_add_disposable_resource._(env, {
            [Symbol.dispose] () {}
        }, !1), y = 2;
        console.log(w, x, y, z);
    } catch (e) {
        env.error = e, env.hasError = !0;
    } finally{
        _ts_dispose_resources._(env);
    }
    let x = 1, w = 3, _default = 4;
});
