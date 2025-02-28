var n, o;
function a() {
    n = a;
    o = a;
    return a;
}
var r = a();
console.log(n === o, o === r, r === n);
