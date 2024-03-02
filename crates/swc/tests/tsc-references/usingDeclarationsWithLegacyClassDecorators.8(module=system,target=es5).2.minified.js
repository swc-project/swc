//// [usingDeclarationsWithLegacyClassDecorators.8.ts]
System.register([
    "@swc/helpers/_/_class_call_check",
    "@swc/helpers/_/_ts_decorate",
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(_export, _context) {
    var _class_call_check, _ts_decorate, _dispose, _using, C;
    return {
        setters: [
            function(_class_call_check1) {
                _class_call_check = _class_call_check1._;
            },
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
            _export("C", C = function C() {
                _class_call_check(this, C);
            });
            try {
                var _stack = [];
                _export("C", C = _ts_decorate([
                    dec
                ], C)), _using(_stack, null);
            } catch (_) {
                var _error = _, _hasError = !0;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    };
});
