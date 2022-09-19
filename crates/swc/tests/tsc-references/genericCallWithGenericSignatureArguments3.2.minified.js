//// [genericCallWithGenericSignatureArguments3.ts]
var E, F;
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), function(F) {
    F[F.A = 0] = "A";
}(F || (F = {})), E.A;
