//// [objectTypeWithCallSignatureAppearsToBeFunctionType.ts]
// objects with call signatures should be permitted where function types are expected
// no errors expected below
var i, b;
i(), i.apply, b(), b.apply;
