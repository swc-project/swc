//// [usingDeclarationsTopLevelOfModule.2.ts]
define([
    "require",
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(require, _dispose, _using) {
    "use strict";
    try {
        var _stack = [];
        var z = _using._(_stack, {
            [Symbol.dispose] () {}
        });
        var y = 2;
        console.log(y, z);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        _dispose._(_stack, _error, _hasError);
    }
    return 4;
});
