//// [optionalChainingInArrow.ts]
// https://github.com/microsoft/TypeScript/issues/41814
var test = function(names) {
    var // single-line comment
    _names_filter, _this;
    return (_this = names) === null || _this === void 0 ? void 0 : (_names_filter = _this.filter) === null || _names_filter === void 0 ? void 0 : _names_filter.call(_this, function(x) {
        return x;
    });
};
