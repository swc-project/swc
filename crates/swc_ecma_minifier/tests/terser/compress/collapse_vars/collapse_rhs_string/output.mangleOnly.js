var a, b;
function c() {
    a = "foo";
    b = "foo";
    return "foo";
}
var d = c();
console.log(a === b, b === d, d === a);
