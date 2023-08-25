//// [objectTypeWithCallSignatureHidingMembersOfExtendedFunction.ts]
// object types with call signatures can override members of Function
// no errors expected below 
var i, x;
i.apply, i.call, i.arguments, i.data, i.hm, x.apply, x.call, x.arguments, x.data, x.hm;
 // should be Object
