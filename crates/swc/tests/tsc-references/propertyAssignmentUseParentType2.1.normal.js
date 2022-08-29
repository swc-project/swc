//// [propertyAssignmentUseParentType2.js]
/** @type {{ (): boolean; nuo: 789 }} */ export var inlined = function() {
    return true;
};
inlined.nuo = 789;
/** @type {{ (): boolean; nuo: 789 }} */ export var duplicated = function() {
    return true;
};
/** @type {789} */ duplicated.nuo = 789;
/** @type {{ (): boolean; nuo: 789 }} */ export var conflictingDuplicated = function() {
    return true;
};
/** @type {1000} */ conflictingDuplicated.nuo = 789;
