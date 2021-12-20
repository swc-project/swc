// @declaration: true
var a = ""; // error
var b = ""; // ok
var c = 123; // error
a = b; // error
b = a; // ok
const foo = {
    bar: 'bar'
}; // ok
const bar = {
    bar: 'bar'
}; // error
