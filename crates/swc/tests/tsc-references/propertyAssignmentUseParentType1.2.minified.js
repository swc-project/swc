//// [propertyAssignmentUseParentType1.ts]
export var interfaced = function() {
    return !0;
};
interfaced.num = 123;
export var inlined = function() {
    return !0;
};
inlined.nun = 456;
export var ignoreJsdoc = function() {
    return !0;
};
/** @type {string} make sure to ignore jsdoc! */ ignoreJsdoc.extra = 111;
