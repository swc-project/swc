//// [usingDeclarationsTopLevelOfModule.3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "y", {
    enumerable: true,
    get: function() {
        return y;
    }
});
const _dispose = require("@swc/helpers/_/_dispose");
const _using = require("@swc/helpers/_/_using");
function f() {
    console.log(y, z);
}
try {
    var _stack = [];
    var z = _using._(_stack, {
        [Symbol.dispose] () {}
    });
    if (false) {
        var y = 1;
    }
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose._(_stack, _error, _hasError);
}
