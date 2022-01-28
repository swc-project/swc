var a, b;
function f() {
    a = f;
    b = f;
    return f;
}
var c = f();
console.log(a === b, b === c, c === a);
