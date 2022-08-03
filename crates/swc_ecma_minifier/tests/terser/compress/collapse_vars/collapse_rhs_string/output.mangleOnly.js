var r, n;
function a() {
    r = "foo";
    n = "foo";
    return "foo";
}
var o = a();
console.log(r === n, n === o, o === r);
