//// [subtypingWithGenericConstructSignaturesWithOptionalParameters.ts]
// call signatures in derived types must have the same or fewer optional parameters as the base type
(function(ClassTypeParam) {})(ClassTypeParam || (ClassTypeParam = {}));
(function(GenericSignaturesInvalid) {})(GenericSignaturesInvalid || (GenericSignaturesInvalid = {}));
(function(GenericSignaturesValid) {})(GenericSignaturesValid || (GenericSignaturesValid = {}));
var ClassTypeParam, GenericSignaturesInvalid, GenericSignaturesValid;
