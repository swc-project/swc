//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
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
        execute: async function() {
            _export("x", 1), _export("w", 3);
            try {
                var _stack = [], z = _using(_stack, {
                    async [Symbol.asyncDispose] () {}
                }, !0);
                console.log(3, 1, 2, z);
            } catch (_) {
                var _error = _, _hasError = !0;
            } finally{
                await _dispose(_stack, _error, _hasError);
            }
        }
    };
});
