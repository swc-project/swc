var r, a;
function n() {
    r = /bar/;
    a = /bar/;
    return /bar/;
}
var o = n();
console.log(r === a, a === o, o === r);
