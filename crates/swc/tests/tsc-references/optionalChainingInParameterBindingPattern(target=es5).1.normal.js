//// [optionalChainingInParameterBindingPattern.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var ref;
var a = function() {
    return undefined;
};
(function(param) {
    var tmp = param[(ref = a()) === null || ref === void 0 ? void 0 : ref.d], c = tmp === void 0 ? "" : tmp;
})();
