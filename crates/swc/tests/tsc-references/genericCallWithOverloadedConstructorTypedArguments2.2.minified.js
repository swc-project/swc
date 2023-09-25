//// [genericCallWithOverloadedConstructorTypedArguments2.ts]
// Function typed arguments with multiple signatures must be passed an implementation that matches all of them
// Inferences are made quadratic-pairwise to and from these overload sets
var NonGenericParameter, GenericParameter;
NonGenericParameter || (NonGenericParameter = {}), GenericParameter || (GenericParameter = {});
