var a, b;
function c() {
    a = /bar/;
    b = /bar/;
    return /bar/;
}
var d = c();
console.log(a === b, b === d, d === a);
