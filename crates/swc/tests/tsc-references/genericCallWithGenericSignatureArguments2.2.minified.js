//// [genericCallWithGenericSignatureArguments2.ts]
var onlyT, TU;
!function(onlyT) {
    var E, F, E1, F1, foo3 = function(x, a, b) {};
    (E1 = E || (E = {}))[E1.A = 0] = "A", (F1 = F || (F = {}))[F1.A = 0] = "A", foo3(E.A, function(x) {
        return E.A;
    }, function(x) {
        return F.A;
    });
}(onlyT || (onlyT = {})), function(TU) {
    var E, F, E1, F1, foo3 = function(x, a, b) {};
    (E1 = E || (E = {}))[E1.A = 0] = "A", (F1 = F || (F = {}))[F1.A = 0] = "A", foo3(E.A, function(x) {
        return E.A;
    }, function(x) {
        return F.A;
    });
}(TU || (TU = {}));
