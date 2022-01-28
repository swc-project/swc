var a, b;
function f() {
    a = {};
    b = {};
    return {};
}
var c = f();
console.log(a === b, b === c, c === a);
