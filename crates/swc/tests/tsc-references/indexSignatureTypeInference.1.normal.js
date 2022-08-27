//// [indexSignatureTypeInference.ts]
var numberMap;
var stringMap;
var v1;
var v1 = numberMapToArray(numberMap); // Ok
var v1 = numberMapToArray(stringMap); // Ok
var v1 = stringMapToArray(numberMap); // Error expected here
var v1 = stringMapToArray(stringMap); // Ok
