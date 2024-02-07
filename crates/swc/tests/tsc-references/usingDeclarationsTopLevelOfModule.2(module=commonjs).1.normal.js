//// [usingDeclarationsTopLevelOfModule.2.ts]
"use strict";
const _dispose = require("@swc/helpers/_/_dispose");
const _using = require("@swc/helpers/_/_using");
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
module.exports = 4;
