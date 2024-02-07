//// [usingDeclarationsWithLegacyClassDecorators.3.ts]
System.register([
    "@swc/helpers/_/_ts_decorate",
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(_export, _context) {
    "use strict";
    var _ts_decorate, _dispose, _using;
    return {
        setters: [
            function(_ts_decorate1) {
                _ts_decorate = _ts_decorate1._;
            },
            function(_dispose1) {
                _dispose = _dispose1._;
            },
            function(_using1) {
                _using = _using1._;
            }
        ],
        execute: function() {
            try {
                var _stack = [];
                var before = _using(_stack, null);
                var C = class C {
                };
                _export("default", C = _ts_decorate([
                    dec
                ], C));
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    };
});
