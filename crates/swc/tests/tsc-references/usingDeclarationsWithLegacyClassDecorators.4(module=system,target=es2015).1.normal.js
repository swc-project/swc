//// [usingDeclarationsWithLegacyClassDecorators.4.ts]
System.register([
    "@swc/helpers/_/_ts_decorate",
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(_export, _context) {
    "use strict";
    var _ts_decorate, _ts_add_disposable_resource, _ts_dispose_resources, _class, env;
    _export("default", void 0);
    return {
        setters: [
            function(_ts_decorate1) {
                _ts_decorate = _ts_decorate1._;
            },
            function(_ts_add_disposable_resource1) {
                _ts_add_disposable_resource = _ts_add_disposable_resource1._;
            },
            function(_ts_dispose_resources1) {
                _ts_dispose_resources = _ts_dispose_resources1._;
            }
        ],
        execute: function() {
            env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const before = _ts_add_disposable_resource(env, null, false);
                ;
                _export("default", _class = _ts_decorate([
                    dec
                ], _class));
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
            _export("default", _class = class _class {
            });
        }
    };
});
