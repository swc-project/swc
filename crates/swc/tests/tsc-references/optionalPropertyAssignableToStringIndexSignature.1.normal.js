//// [optionalPropertyAssignableToStringIndexSignature.ts]
stringDictionary1 = optionalProperties; // ok
stringDictionary1 = undefinedProperties; // error
probablyArray1 = numberLiteralKeys; // error
var dict = optionalUndefined; // error
function f() {
    var optional = undefined;
    var dict = optional; // ok
}
