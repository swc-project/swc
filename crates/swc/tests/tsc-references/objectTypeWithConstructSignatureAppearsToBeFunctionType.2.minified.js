//// [objectTypeWithConstructSignatureAppearsToBeFunctionType.ts]
// no errors expected below 
var i, b;
i(), new i(), i.apply, b(), new b(), b.apply;
