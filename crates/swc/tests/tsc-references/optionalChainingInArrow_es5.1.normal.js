// @target: es5
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/41814
var test = function(names) {
    // single-line comment
    return names === null || names === void 0 ? void 0 : names.filter(function(x) {
        return x;
    });
};
