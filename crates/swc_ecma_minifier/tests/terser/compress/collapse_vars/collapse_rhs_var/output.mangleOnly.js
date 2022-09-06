var n, o;
function r() {
    n = r;
    o = r;
    return r;
}
var a = r();
console.log(n === o, o === a, a === n);
