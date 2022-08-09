// @strict: true
stringDictionary = optionalProperties; // ok
stringDictionary = undefinedProperties; // error
probablyArray = numberLiteralKeys; // error
let dict = optionalUndefined; // error
function f() {
    let optional = undefined;
    let dict = optional; // ok
}
