//// [usingDeclarationsTopLevelOfModule.1.ts]
System.register([
    "@swc/helpers/_/_using_ctx"
], function(_export, _context) {
    var _using_ctx;
    return _export({
        x: void 0,
        w: void 0
    }), {
        setters: [
            function(_using_ctx1) {
                _using_ctx = _using_ctx1._;
            }
        ],
        execute: function() {
            try {
                var _usingCtx = _using_ctx();
                _export("x", 1);
                var z = _usingCtx.u({
                    [Symbol.dispose] () {}
                });
                _export("w", 3), console.log(3, 1, 2, z);
            } catch (_) {
                _usingCtx.e = _;
            } finally{
                _usingCtx.d();
            }
        }
    };
});
