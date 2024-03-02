//// [usingDeclarationsWithLegacyClassDecorators.10.ts]
System.register([
    "@swc/helpers/_/_class_call_check",
    "@swc/helpers/_/_ts_decorate",
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(_export, _context) {
    "use strict";
    var _class_call_check, _ts_decorate, _dispose, _using;
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
            try {
                var _stack = [];
                var _class = function _class() {
                    "use strict";
                    _class_call_check(this, _class);
                };
                _export("default", _class = _ts_decorate([
                    dec
                ], _class));
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
