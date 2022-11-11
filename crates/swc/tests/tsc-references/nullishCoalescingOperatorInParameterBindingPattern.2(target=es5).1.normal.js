//// [nullishCoalescingOperatorInParameterBindingPattern.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {
    return undefined;
};
var _a;
(function(param) {
    var tmp = param[(_a = a()) !== null && _a !== void 0 ? _a : "d"], c = tmp === void 0 ? "" : tmp;
    var a1;
})();
var x = "";
var _a1;
(function(param) {
    var tmp = param[(_a1 = a()) !== null && _a1 !== void 0 ? _a1 : "d"], c = tmp === void 0 ? "" : tmp, _param_d = param.d, d = _param_d === void 0 ? x : _param_d;
    var x1;
})();
