//// [usingDeclarationsWithLegacyClassDecorators.8.ts]
System.register([
    "@swc/helpers/_/_ts_decorate",
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(_export, _context) {
    "use strict";
    var _ts_decorate, _dispose, _using, _C;
    _export("C", void 0);
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
                class C {
                }
                _export("C", _C = C);
                C = _ts_decorate([
                    dec
                ], C);
                var after = _using(_stack, null);
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    };
});
