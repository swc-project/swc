//// [optionalChainingInParameterBindingPattern.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var _a;
var a = function() {
    return undefined;
};
(function(param) {
    var tmp = param[(_a = a()) === null || _a === void 0 ? void 0 : _a.d], c = tmp === void 0 ? "" : tmp;
})();
