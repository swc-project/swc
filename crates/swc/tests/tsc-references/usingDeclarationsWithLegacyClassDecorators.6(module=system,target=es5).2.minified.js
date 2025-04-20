//// [usingDeclarationsWithLegacyClassDecorators.6.ts]
System.register([
    "@swc/helpers/_/_class_call_check",
    "@swc/helpers/_/_ts_decorate",
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(_export, _context) {
    var _class_call_check, _ts_decorate, _ts_add_disposable_resource, _ts_dispose_resources, env;
    return {
        setters: [
            function(_class_call_check1) {
                _class_call_check = _class_call_check1._;
            },
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
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env, null, !1);
                var C = function C() {
                    _class_call_check(this, C);
                };
                _export("D", C = _ts_decorate([
                    dec
                ], C));
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }
    };
});
