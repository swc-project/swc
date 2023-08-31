//// [unionTypeReadonly.ts]
var identical, mutable, differentType, differentName;
(void 0).value = 12 // error, lhs can't be a readonly property
, identical.value = 12, mutable.value = 12, differentType.value = 12, differentName.value = 12;
 // error, property 'value' doesn't exist
