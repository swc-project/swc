//// [usingDeclarationsTopLevelOfModule.3.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "y", {
    enumerable: !0,
    get: function() {
        return y;
    }
});
const _dispose = require("@swc/helpers/_/_dispose"), _using = require("@swc/helpers/_/_using");
try {
    var y, _stack = [];
    _using._(_stack, {
        [Symbol.dispose] () {}
    });
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose._(_stack, _error, _hasError);
}
