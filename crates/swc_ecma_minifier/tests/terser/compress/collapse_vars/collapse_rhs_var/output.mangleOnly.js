var a, b;
function c() {
    a = c;
    b = c;
    return c;
}
var d = c();
console.log(a === b, b === d, d === a);
