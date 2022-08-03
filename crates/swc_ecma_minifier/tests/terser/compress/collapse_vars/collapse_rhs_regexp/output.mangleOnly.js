var r, a;
function b() {
    r = /bar/;
    a = /bar/;
    return /bar/;
}
var n = b();
console.log(r === a, a === n, n === r);
