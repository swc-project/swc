//// [usingDeclarationsTopLevelOfModule.2.ts]
const _dispose = require("@swc/helpers/_/_dispose"), _using = require("@swc/helpers/_/_using");
try {
    var _stack = [], z = _using._(_stack, {
        [Symbol.dispose] () {}
    });
    console.log(2, z);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose._(_stack, _error, _hasError);
}
module.exports = 4;
