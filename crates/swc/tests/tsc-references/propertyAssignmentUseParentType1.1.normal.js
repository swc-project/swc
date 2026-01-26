//// [propertyAssignmentUseParentType1.ts]
export var interfaced = function interfaced() {
    return true;
};
interfaced.num = 123;
export var inlined = function inlined() {
    return true;
};
inlined.nun = 456;
export var ignoreJsdoc = function ignoreJsdoc() {
    return true;
};
/** @type {string} make sure to ignore jsdoc! */ ignoreJsdoc.extra = 111;
