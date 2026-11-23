//// [usingDeclarationsTopLevelOfModule.1.ts]
System.register([
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(_export, _context) {
    var _ts_add_disposable_resource, _ts_dispose_resources, env, z;
    return _export({
        default: void 0,
        w: void 0,
        x: void 0,
        y: void 0
    }), {
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
                _export("x", 1), z = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, !1), _export("y", 2), _export("w", 3), _export("default", 4), console.log(3, 1, 2, z);
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }
    };
});
