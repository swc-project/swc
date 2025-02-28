var r, a;
function o() {
    r = /bar/;
    a = /bar/;
    return /bar/;
}
var n = o();
console.log(r === a, a === n, n === r);
