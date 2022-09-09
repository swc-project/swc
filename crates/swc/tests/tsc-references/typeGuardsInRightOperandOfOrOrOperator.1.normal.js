//// [typeGuardsInRightOperandOfOrOrOperator.ts]
// In the right operand of a || operation, 
// the type of a variable or parameter is narrowed by any type guard in the left operand when false, 
// provided the right operand contains no assignments to the variable or parameter.
function foo(x) {
    return typeof x !== "string" || x.length === 10; // string
}
function foo2(x) {
    // modify x in right hand operand
    return typeof x !== "string" || (x = 10) || x; // string | number
}
function foo3(x) {
    // modify x in right hand operand with string type itself
    return typeof x !== "string" || (x = "hello") || x; // string | number
}
function foo4(x) {
    return typeof x === "string" // string | number | boolean
     || typeof x === "number" // number | boolean
     || x; // boolean
}
function foo5(x) {
    // usage of x or assignment to separate variable shouldn't cause narrowing of type to stop
    var b;
    return typeof x === "string" // string | number | boolean
     || (b = x) || typeof x === "number" // number | boolean
     || x; // boolean
}
function foo6(x) {
    // Mixing typeguard
    return typeof x === "string" // string | number | boolean
     || (typeof x !== "number" // number | boolean
     ? x // boolean
     : x === 10 // number 
    );
}
function foo7(x) {
    var y;
    var z;
    // Mixing typeguard narrowing
    return typeof x === "string" || (z = x // number | boolean
    ) || (typeof x === "number" ? (x = 10) && x.toString() // number | boolean | string
     : (y = x) && x.toString()); // number | boolean | string
}
