var a, b;
function f() {
    a = "foo";
    b = "foo";
    return "foo";
}
var c = f();
console.log(a === b, b === c, c === a);
