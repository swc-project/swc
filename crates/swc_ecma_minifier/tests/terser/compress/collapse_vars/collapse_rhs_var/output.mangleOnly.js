var r, n;
function a() {
    r = a;
    n = a;
    return a;
}
var o = a();
console.log(r === n, n === o, o === r);
