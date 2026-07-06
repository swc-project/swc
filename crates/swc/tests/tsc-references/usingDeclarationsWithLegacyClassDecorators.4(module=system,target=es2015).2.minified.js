//// [usingDeclarationsWithLegacyClassDecorators.4.ts]
System.register([
    "@swc/helpers/_/_ts_decorate",
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(_export, _context) {
    var _class, _ts_add_disposable_resource, _ts_decorate, _ts_dispose_resources, env;
    return _export("default", void 0), {
        setters: [
            function(_ts_decorate_ns) {
                _ts_decorate = _ts_decorate_ns._;
            },
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
                _ts_add_disposable_resource(env, null, !1), _class = class {
                }, _export("default", _class), _class = _ts_decorate([
                    dec
                ], _class), _export("default", _class);
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }
    };
});
