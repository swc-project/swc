//// [optionalChainingInArrow.ts]
// https://github.com/microsoft/TypeScript/issues/41814
var test = function(names) {
    var // single-line comment
    _names;
    return (_names = names) === null || _names === void 0 ? void 0 : _names.filter(function(x) {
        return x;
    });
};
