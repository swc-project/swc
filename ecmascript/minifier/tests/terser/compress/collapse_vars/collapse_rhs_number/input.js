var a, b;
function f() {
    a = 42;
    b = 42;
    return 42;
}
var c = f();
console.log(a === b, b === c, c === a);
