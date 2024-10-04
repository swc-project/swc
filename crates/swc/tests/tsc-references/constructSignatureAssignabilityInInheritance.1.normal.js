//// [constructSignatureAssignabilityInInheritance.ts]
// Checking basic subtype relations with construct signatures
(function(MemberWithConstructSignature) {
    var b;
    var r = new b.a(1);
})(MemberWithConstructSignature || (MemberWithConstructSignature = {}));
var MemberWithConstructSignature;
