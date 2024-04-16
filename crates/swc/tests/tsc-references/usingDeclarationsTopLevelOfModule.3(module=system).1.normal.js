//// [usingDeclarationsTopLevelOfModule.3.ts]
System.register([
    "@swc/helpers/_/_using_ctx"
], function(_export, _context) {
    "use strict";
    var _using_ctx;
    function f() {
        console.log(y, z);
    }
    return {
        setters: [
            function(_using_ctx1) {
                _using_ctx = _using_ctx1._;
            }
        ],
        execute: function() {
            try {
                var _usingCtx = _using_ctx();
                var z = _usingCtx.u({
                    [Symbol.dispose] () {}
                });
                if (false) {
                    var y = 1;
                }
            } catch (_) {
                _usingCtx.e = _;
            } finally{
                _usingCtx.d();
            }
        }
    };
});
