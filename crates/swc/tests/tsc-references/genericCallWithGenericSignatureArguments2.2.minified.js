//// [genericCallWithGenericSignatureArguments2.ts]
// When a function expression is inferentially typed (section 4.9.3) and a type assigned to a parameter in that expression references type parameters for which inferences are being made, 
// the corresponding inferred type arguments to become fixed and no further candidate inferences are made for them.
var onlyT, TU, E, F, E1, F1, E2, F2, E3, F3;
onlyT || (onlyT = {}), (E1 = E || (E = {}))[E1.A = 0] = "A", (F1 = F || (F = {}))[F1.A = 0] = "A", E.A, TU || (TU = {}), (E3 = E2 || (E2 = {}))[E3.A = 0] = "A", (F3 = F2 || (F2 = {}))[F3.A = 0] = "A", E2.A;
