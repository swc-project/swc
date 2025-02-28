var o, f;
function r() {
    o = "foo";
    f = "foo";
    return "foo";
}
var n = r();
console.log(o === f, f === n, n === o);
