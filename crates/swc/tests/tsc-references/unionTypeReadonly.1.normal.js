//// [unionTypeReadonly.ts]
var base;
base.value = 12 // error, lhs can't be a readonly property
;
var identical;
identical.value = 12; // error, lhs can't be a readonly property
var mutable;
mutable.value = 12; // error, lhs can't be a readonly property
var differentType;
differentType.value = 12; // error, lhs can't be a readonly property
var differentName;
differentName.value = 12; // error, property 'value' doesn't exist
