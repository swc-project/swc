let base;
base.value = 12 // error, lhs can't be a readonly property
;
let identical;
identical.value = 12; // error, lhs can't be a readonly property
let mutable;
mutable.value = 12; // error, lhs can't be a readonly property
let differentType;
differentType.value = 12; // error, lhs can't be a readonly property
let differentName;
differentName.value = 12; // error, property 'value' doesn't exist
