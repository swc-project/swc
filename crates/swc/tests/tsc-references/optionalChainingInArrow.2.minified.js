//// [optionalChainingInArrow.ts]
var test = function(names) {
    return null == names ? void 0 : names.filter(function(x) {
        return x;
    });
};
