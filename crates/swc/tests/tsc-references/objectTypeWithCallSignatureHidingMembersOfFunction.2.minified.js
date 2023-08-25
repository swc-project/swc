//// [objectTypeWithCallSignatureHidingMembersOfFunction.ts]
// object types with call signatures can override members of Function
// no errors expected below 
var i, x;
i.apply, i.call, i.arguments, x.apply, x.call, x.arguments;
