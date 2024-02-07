//// [usingDeclarationsWithLegacyClassDecorators.10.ts]
System.register([
    "@swc/helpers/_/_ts_decorate",
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(_export, _context) {
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
                var _stack = [], _class = class {
                };
                _export("default", _class = _ts_decorate([
                    dec
                ], _class)), _using(_stack, null);
            } catch (_) {
                var _error = _, _hasError = !0;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    };
});
