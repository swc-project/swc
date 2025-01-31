//// [usingDeclarationsTopLevelOfModule.1.ts]
System.register([
    "@swc/helpers/_/_ts_add_disposable_resource",
    "@swc/helpers/_/_ts_dispose_resources"
], function(_export, _context) {
    "use strict";
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
        execute: function() {
            env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const z = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
                const y = 2;
                console.log(w, x, y, z);
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
            _export("x", x = 1);
            _export("w", w = 3);
            _export("default", 4);
        }
    };
});
