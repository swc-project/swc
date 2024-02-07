//// [usingDeclarationsTopLevelOfModule.1.ts]
System.register([
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(_export, _context) {
    "use strict";
    var _dispose, _using, x, w;
    return {
        setters: [
            function(_dispose1) {
                _dispose = _dispose1._;
            },
            function(_using1) {
                _using = _using1._;
            }
        ],
        execute: function() {
            _export("x", x = 1);
            _export("w", w = 3);
            try {
                var _stack = [];
                var z = _using(_stack, {
                    [Symbol.dispose] () {}
                });
                var y = 2;
                var _default = 4;
                console.log(w, x, y, z);
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    };
});
