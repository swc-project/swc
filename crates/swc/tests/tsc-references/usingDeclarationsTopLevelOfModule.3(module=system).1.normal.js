//// [usingDeclarationsTopLevelOfModule.3.ts]
System.register([
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(_export, _context) {
    "use strict";
    var _dispose, _using;
    function f() {
        console.log(y, z);
    }
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
            try {
                var _stack = [];
                var z = _using(_stack, {
                    [Symbol.dispose] () {}
                });
                if (false) {
                    var y = 1;
                }
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    };
});
