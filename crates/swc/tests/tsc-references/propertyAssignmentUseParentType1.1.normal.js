//// [propertyAssignmentUseParentType1.ts]
export var interfaced = function() {
    return true;
};
interfaced.num = 123;
export var inlined = function() {
    return true;
};
inlined.nun = 456;
export var ignoreJsdoc = function() {
    return true;
};
/** @type {string} make sure to ignore jsdoc! */ ignoreJsdoc.extra = 111;
