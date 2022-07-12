// @strict: true
stringDictionary = optionalProperties; // ok
stringDictionary = undefinedProperties; // error
probablyArray = numberLiteralKeys; // error
var dict = optionalUndefined; // error
function f() {
    var optional = undefined;
    var dict = optional; // ok
}
