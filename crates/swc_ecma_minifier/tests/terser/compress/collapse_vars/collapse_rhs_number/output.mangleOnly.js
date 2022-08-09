var r, n;
function a() {
    r = 42;
    n = 42;
    return 42;
}
var o = a();
console.log(r === n, n === o, o === r);
