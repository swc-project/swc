var a, b;
function f() {
    a = /bar/;
    b = /bar/;
    return /bar/;
}
var c = f();
console.log(a === b, b === c, c === a);
