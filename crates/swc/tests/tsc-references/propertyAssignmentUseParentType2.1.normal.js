//// [propertyAssignmentUseParentType2.js]
/** @type {{ (): boolean; nuo: 789 }} */ export var inlined = function inlined() {
    return true;
};
inlined.nuo = 789;
/** @type {{ (): boolean; nuo: 789 }} */ export var duplicated = function duplicated() {
    return true;
};
/** @type {789} */ duplicated.nuo = 789;
/** @type {{ (): boolean; nuo: 789 }} */ export var conflictingDuplicated = function conflictingDuplicated() {
    return true;
};
/** @type {1000} */ conflictingDuplicated.nuo = 789;
