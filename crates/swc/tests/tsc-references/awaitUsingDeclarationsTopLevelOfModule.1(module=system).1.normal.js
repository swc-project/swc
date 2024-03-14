//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
System.register([
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(_export, _context) {
    "use strict";
    var _dispose, _using, _x, _w;
    _export({
        x: void 0,
        w: void 0
    });
    return {
        setters: [
            function(_dispose1) {
                _dispose = _dispose1._;
            },
            function(_using1) {
                _using = _using1._;
            }
        ],
        execute: async function() {
            try {
                var _stack = [];
                const x = 1;
                _export("x", _x = x);
                var z = _using(_stack, {
                    async [Symbol.asyncDispose] () {}
                }, true);
                var y = 2;
                const w = 3;
                _export("w", _w = w);
                var _default = 4;
                console.log(w, x, y, z);
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                await _dispose(_stack, _error, _hasError);
            }
        }
    };
});
