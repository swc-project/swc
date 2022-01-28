var a, b;
function f() {
    a = this;
    b = this;
    return this;
}
var c = f();
console.log(a === b, b === c, c === a);
