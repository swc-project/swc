//// [optionalChainingInArrow.ts]
// https://github.com/microsoft/TypeScript/issues/41814
var test = function(names) {
    var // single-line comment
    _names_filter, _object;
    return (_object = names) === null || _object === void 0 ? void 0 : (_names_filter = _object.filter) === null || _names_filter === void 0 ? void 0 : _names_filter.call(_object, function(x) {
        return x;
    });
};
