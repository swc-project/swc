var a, b;
function d() {
    a = /bar/;
    b = /bar/;
    return /bar/;
}
var c = d();
console.log(a === b, b === c, c === a);
