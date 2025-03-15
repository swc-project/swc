//// [usingDeclarationsTopLevelOfModule.3.ts]
System.register([
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(_export, _context) {
    "use strict";
    var _ts_add_disposable_resource, _ts_dispose_resources, env;
    function f() {
        console.log(y, z);
    }
    return {
        setters: [
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
                var z = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
                if (false) {
                    var y = 1;
                }
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
    };
});
