//// [usingDeclarationsWithLegacyClassDecorators.5.ts]
System.register([
    "@swc/helpers/_/_class_call_check",
    "@swc/helpers/_/_ts_decorate",
    "@swc/helpers/_/_using_ctx"
], function(_export, _context) {
    "use strict";
    var _class_call_check, _ts_decorate, _using_ctx;
    return {
        setters: [
            function(_class_call_check1) {
                _class_call_check = _class_call_check1._;
            },
            function(_ts_decorate1) {
                _ts_decorate = _ts_decorate1._;
            },
            function(_using_ctx1) {
                _using_ctx = _using_ctx1._;
            }
        ],
        execute: function() {
            try {
                var _usingCtx = _using_ctx();
                var before = _usingCtx.u(null);
                var C = function C() {
                    "use strict";
                    _class_call_check(this, C);
                };
                _export("C", C = _ts_decorate([
                    dec
                ], C));
            } catch (_) {
                _usingCtx.e = _;
            } finally{
                _usingCtx.d();
            }
        }
    };
});
