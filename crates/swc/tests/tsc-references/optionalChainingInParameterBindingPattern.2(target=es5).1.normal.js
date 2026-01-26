//// [optionalChainingInParameterBindingPattern.2.ts]
var _a, _a1;
// https://github.com/microsoft/TypeScript/issues/36295
var a = function a() {
    return undefined;
};
(function(param) {
    var tmp = param[(_a = a()) === null || _a === void 0 ? void 0 : _a.d], c = tmp === void 0 ? "" : tmp;
    var a1;
})();
var x = "";
(function(param) {
    var c = param[(_a1 = a()) === null || _a1 === void 0 ? void 0 : _a1.d], d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
    var x1;
})();
