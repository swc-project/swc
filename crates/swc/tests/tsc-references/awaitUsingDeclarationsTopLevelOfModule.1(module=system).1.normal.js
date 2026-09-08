//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
System.register([
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(_export, _context) {
    "use strict";
    var _ts_add_disposable_resource, _ts_dispose_resources, env, w, x, y, z;
    _export({
        default: void 0,
        w: void 0,
        x: void 0,
        y: void 0
    });
    return {
        setters: [
            function(_ts_add_disposable_resource_ns) {
                _ts_add_disposable_resource = _ts_add_disposable_resource_ns._;
            },
            function(_ts_dispose_resources_ns) {
                _ts_dispose_resources = _ts_dispose_resources_ns._;
            }
        ],
        execute: async function() {
            env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                z = _ts_add_disposable_resource(env, {
                    async [Symbol.asyncDispose] () {}
                }, true);
                y = 2, _export("y", y), y;
                console.log(w, x, y, z);
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                const result = _ts_dispose_resources(env);
                if (result) await result;
            }
            _export("x", x = 1);
            _export("w", w = 3);
            _export("default", 4);
        }
    };
});
