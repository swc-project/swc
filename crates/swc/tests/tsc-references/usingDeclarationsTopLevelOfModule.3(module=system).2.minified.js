//// [usingDeclarationsTopLevelOfModule.3.ts]
System.register([
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(_export, _context) {
    var _dispose, _using;
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
                _using(_stack, {
                    [Symbol.dispose] () {}
                });
            } catch (_) {
                var _error = _, _hasError = !0;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    };
});
