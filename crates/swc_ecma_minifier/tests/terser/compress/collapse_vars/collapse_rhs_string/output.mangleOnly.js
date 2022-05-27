var a, b;
function d() {
    a = "foo";
    b = "foo";
    return "foo";
}
var c = d();
console.log(a === b, b === c, c === a);
