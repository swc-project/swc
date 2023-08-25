//// [objectTypesIdentityWithGenericConstructSignaturesDifferingByConstraints.ts]
// Two call or construct signatures are considered identical when they have the same number of type parameters and, considering those 
// parameters pairwise identical, have identical type parameter constraints, identical number of parameters with identical kind(required, 
// optional or rest) and types, and identical return types.
import "@swc/helpers/_/_class_call_check";
