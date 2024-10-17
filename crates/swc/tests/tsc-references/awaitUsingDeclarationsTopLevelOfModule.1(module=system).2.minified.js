//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
System.register([
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(_export, _context) {
    var _ts_add_disposable_resource, _ts_dispose_resources, env, x, w;
    return {
        setters: [
            function(_ts_add_disposable_resource1) {
                _ts_add_disposable_resource = _ts_add_disposable_resource1._;
            },
            function(_ts_dispose_resources1) {
                _ts_dispose_resources = _ts_dispose_resources1._;
            }
        ],
        execute: async function() {
            env = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                let z = _ts_add_disposable_resource(env, {
                    async [Symbol.asyncDispose] () {}
                }, !0);
                console.log(w, x, 2, z);
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                let result = _ts_dispose_resources(env);
                result && await result;
            }
            _export("x", x = 1), _export("w", w = 3), _export("default", 4);
        }
    };
});
