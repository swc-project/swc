//// [usingDeclarationsTopLevelOfModule.3.ts]
System.register([
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(_export, _context) {
    var _ts_add_disposable_resource, _ts_dispose_resources, env;
    return _export("y", void 0), {
        setters: [
            function(_ts_add_disposable_resource_ns) {
                _ts_add_disposable_resource = _ts_add_disposable_resource_ns._;
            },
            function(_ts_dispose_resources_ns) {
                _ts_dispose_resources = _ts_dispose_resources_ns._;
            }
        ],
        execute: function() {
            env = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, !1);
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }
    };
});
