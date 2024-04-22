//// [nonPrimitiveUnionIntersection.ts]
var a = ""; // error
var b = ""; // ok
var c = 123; // error
a = b; // error
b = a; // ok
var foo = {
    bar: 'bar'
}; // ok
var bar = {
    bar: 'bar'
}; // error
