//// [usingDeclarationsTopLevelOfModule.3.ts]
System.register([
    "@swc/helpers/_/_using_ctx"
], function(_export, _context) {
    var _using_ctx;
    return {
        setters: [
            function(_using_ctx1) {
                _using_ctx = _using_ctx1._;
            }
        ],
        execute: function() {
            try {
                var _usingCtx = _using_ctx();
                _usingCtx.u({
                    [Symbol.dispose] () {}
                });
            } catch (_) {
                _usingCtx.e = _;
            } finally{
                _usingCtx.d();
            }
        }
    };
});
