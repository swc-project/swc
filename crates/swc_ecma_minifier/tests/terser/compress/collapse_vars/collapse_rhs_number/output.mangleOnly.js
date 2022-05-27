var a, b;
function d() {
    a = 42;
    b = 42;
    return 42;
}
var c = d();
console.log(a === b, b === c, c === a);
