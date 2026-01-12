//// [subtypingWithConstructSignaturesWithSpecializedSignatures.ts]
// same as subtypingWithCallSignatures but with additional specialized signatures that should not affect the results
(function(CallSignature) {})(CallSignature || (CallSignature = {}));
(function(MemberWithCallSignature) {})(MemberWithCallSignature || (MemberWithCallSignature = {}));
var CallSignature, MemberWithCallSignature;
