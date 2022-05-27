var a, b;
function d() {
    a = d;
    b = d;
    return d;
}
var c = d();
console.log(a === b, b === c, c === a);
