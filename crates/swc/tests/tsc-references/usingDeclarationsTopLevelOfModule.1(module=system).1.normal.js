//// [usingDeclarationsTopLevelOfModule.1.ts]
System.register([
    "@swc/helpers/_/_using_ctx"
], function(_export, _context) {
    "use strict";
    var _using_ctx, _x, _w;
    _export({
        x: void 0,
        w: void 0
    });
    return {
        setters: [
            function(_using_ctx1) {
                _using_ctx = _using_ctx1._;
            }
        ],
        execute: function() {
            try {
                var _usingCtx = _using_ctx();
                const x = 1;
                _export("x", _x = x);
                var z = _usingCtx.u({
                    [Symbol.dispose] () {}
                });
                const y = 2;
                const w = 3;
                _export("w", _w = w);
                var _default = 4;
                console.log(w, x, y, z);
            } catch (_) {
                _usingCtx.e = _;
            } finally{
                _usingCtx.d();
            }
        }
    };
});
